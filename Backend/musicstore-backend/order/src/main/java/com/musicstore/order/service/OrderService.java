package com.musicstore.order.service;

import com.itextpdf.html2pdf.HtmlConverter;
import com.musicstore.order.dto.OrderAvailabilityListItem;
import com.musicstore.order.dto.OrderAvailabilityResponse;
import com.musicstore.order.dto.OrderCancelRequest;
import com.musicstore.order.dto.OrderLineItemsDto;
import com.musicstore.order.dto.OrderRequest;
import com.musicstore.order.dto.OrderUpdateRequest;
import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.model.OrderStatus;
import com.musicstore.order.repository.OrderRepository;
import com.musicstore.order.security.config.VariablesConfiguration;
import jakarta.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;

    private final WebClient.Builder webClient;

    private final VariablesConfiguration variablesConfiguration;

    @Transactional
    public String createOrder(OrderRequest request, String csrfToken, String jwtToken) {

        if (!jwtToken.startsWith("Bearer ")) {
            log.error("No admin authority for token - " + jwtToken);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
        }

        List<OrderAvailabilityListItem> itemsNotAvailable = new ArrayList<>();

        OrderAvailabilityResponse response;

        response = webClient.build()
                .post()
                .uri(variablesConfiguration.getOrderCheckUrl())
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie("XSRF-TOKEN", csrfToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OrderAvailabilityResponse.class)
                .block();

        Objects.requireNonNull(response);

        response.getAvailableItems().forEach(
                item -> {
                    if (!item.getIsAvailable()) {
                        itemsNotAvailable.add(item);
                    }
                });

        if (!itemsNotAvailable.isEmpty()) {
            log.error("Not all items are available for order - " + request);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "We could not complete your order. Not all items are available.");
        }

        Order order = new Order(
                request.getUserIdentifier(),
                request.getName(),
                request.getSurname(),
                request.getEmail(),
                request.getPhone(),
                request.getCountry(),
                request.getStreetAddress(),
                request.getCity(),
                request.getZipCode(),
                request.getOrderTotalPrice(),
                request.getItems()
                        .stream()
                        .map(this::mapToDto)
                        .toList());

        orderRepository.save(order);
        log.info("Order created - " + order.getOrderIdentifier());

        return "Order placed successfully";

    }

    public ResponseEntity<Page<Order>> getAllOrdersByUserId(
            UUID userId,
            Integer page,
            Integer pageSize) {

        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                Sort.by("dateCreated")
                        .descending());

        Page<Order> orders = orderRepository.findAllByUserIdentifier(userId, pageable);

        return ResponseEntity.ok(orders);
    }

    public ResponseEntity<Page<Order>> getAllOrders(Integer page, Integer pageSize) {

        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                Sort.by("dateCreated").descending());

        Page<Order> orders = orderRepository.findAll(pageable);

        return ResponseEntity.ok(orders);
    }

    public ResponseEntity<Order> getOrderDetails(UUID orderId) {

        Order order = orderRepository.findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Order not found"));

        return ResponseEntity.ok(order);
    }

    @Transactional
    public ResponseEntity<String> updateOrderStatus(
            UUID orderId, String token,
            String csrfToken, OrderUpdateRequest request) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No admin authority");
        }

        Order order = orderRepository
                .findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Order not found"));

        if (request.getStatus().equals(OrderStatus.CANCELED)
                || request.getStatus().equals(OrderStatus.FAILED)) {
            OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
            orderCancelRequest.setItems(request.getItemsToCancel());
            Boolean response = webClient.build()
                    .post()
                    .uri(variablesConfiguration.getOrderCancellationUrl())
                    .header("X-XSRF-TOKEN", csrfToken)
                    .cookie("XSRF-TOKEN", csrfToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(orderCancelRequest)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            if (!Boolean.TRUE.equals(response)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Order update failed because of bad products in list");
            }

        }

        order.setStatus(request.getStatus());
        orderRepository.save(order);
        log.info("Order updated - " + order.getOrderIdentifier());
        return ResponseEntity.ok("Order status updated successfully");
    }

    public byte[] generatePdfFileResponse(UUID uuid, String token) throws FileNotFoundException {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No admin authority");
        }

        String pdfHtml = generatePdfSource(uuid);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        HtmlConverter.convertToPdf(pdfHtml, out);

        byte[] file = out.toByteArray();

        return file;

    }

    public String generateProductsTable(List<OrderLineItems> products) {

    String table = "";

    products.forEach((product) -> {
        BigDecimal total = product.getUnitPrice().multiply(BigDecimal.valueOf(product.getQuantity()));
        table.concat(
                "<table class='row row-7' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
                        + "<tbody>"
                        + "<tr>"
                        + "<td>"
                        + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: " 
                        + "0pt; background-color: #FFFFFF; color: #333; width: 620px; margin: 0 auto;' width='620'>"
                        + "<tbody>"
                        + "<tr>"
                        + "<td class='column column-1' width='66.66666666666667%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 15px; vertical-align: top;'>"
                        + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
                        + "<tr th:each=''>"
                        + "<td class='pad' style='padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;'>"
                        + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;'>"
                        + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word; color: rgb(0,0,0);'><p style='text-decoration: none; color: #71777D;' " 
                        + "data-mce-style='text-decoration: none; color: #000000;'>"
                        + product.getProductName() + "</p></span></p>"
                        + "</div>"
                        + "</td>"
                        + "</tr>"
                        + "</table>"
                        + "</td>"
                        + "<td class='column column-2' width='33.333333333333336%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 15px; vertical-align: top;'>"
                        + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
                        + "<tr th:each='product : ${products}'>"
                        + "<td class='pad' style='padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;'>"
                        + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;'>"
                        + "<p style='margin: 0; word-break: break-word;'>"
                        + total + "</p>"
                        + "</div>"
                        + "</td>"
                        + "</tr>"
                        + "</table>"
                        + "</td>"
                        + "</tr>"
                        + "</tbody>"
                        + "</table>"
                        + "</td>"
                        + "</tr>"
                        + "</tbody>"
                        + "</table>"
                        + "<table class='row row-9' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
                        + "<tbody>"
                        + "<tr th:each='product : ${products}'>"
                        + "<td>"
                        + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; " 
                        + "color: #000000; width: 620px; margin: 0 auto;' width='620'>"
                        + "<tbody>"
                        + "<tr>"
                        + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
                        + "<table class='divider_block block-1' width='100%' border='0' cellpadding='10' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
                        + "<tr>"
                        + "<td class='pad'>"
                        + "<div class='alignment' align='center'>"
                        + "<table border='0' cellpadding='0' cellspacing='0' role='presentation' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
                        + "<tr>"
                        + "<td class='divider_inner' style='font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;'><span style='word-break: break-word;'>&#8202;</span></td>"
                        + "</tr>"
                        + "</table>"
                        + "</div>"
                        + "</td>"
                        + "</tr>"
                        + "</table>"
                        + "</td>"
                        + "</tr>"
                        + "</tbody>"
                        + "</table>"
                        + "</td>"
                        + "</tr>"
                        + "</tbody>"
                        + "</table>");
    });

        return table;

    }

    public String generatePdfSource(UUID uuid) {

        Order order = orderRepository.findByOrderIdentifier(uuid)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Order with id: " + uuid + " not found"));

        DateFormat format = new SimpleDateFormat("dd/MM/yy");
        String date = format.format(new Date());

        String invoiceId = "FS/" + date + "/" + uuid;

        String pdf = "<!DOCTYPE html>"
            + "<html xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office' lang='en'>"
            + "<head>"
            + "<title></title>"
            + "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>"
            + "<meta name='viewport' content='width=device-width, initial-scale=1.0'><!--[if mso]>"
            + "<xml><w:WordDocument xmlns:w='urn:schemas-microsoft-com:office:word'><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>"
            + "<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>"
            + "<![endif]--><!--[if !mso]><!-->"
            + "<link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'><!--<![endif]-->"
            + "<style>"
            + "* {"
            + "box-sizing: border-box;"
            + "}"
            + ""
            + "body {"
            + "margin: 0;"
            + "padding: 0;"
            + "}"
            + ""
            + "a[x-apple-data-detectors] {"
            + "color: inherit !important;"
            + "text-decoration: inherit !important;"
            + "}"
            + ""
            + "#MessageViewBody a {"
            + "color: inherit;"
            + "text-decoration: none;"
            + "}"
            + ""
            + "p {"
            + "line-height: inherit"
            + "}"
            + ""
            + ".desktop_hide,"
            + ".desktop_hide table {"
            + "mso-hide: all;"
            + "display: none;"
            + "max-height: 0px;"
            + "overflow: hidden;"
            + "}"
            + ""
            + ".image_block img+div {"
            + "display: none;"
            + "}"
            + ""
            + "sup,"
            + "sub {"
            + "font-size: 75%;"
            + "line-height: 0;"
            + "}"
            + ""
            + "@media (max-width:640px) {"
            + ".desktop_hide table.icons-inner {"
            + "display: inline-block !important;"
            + "}"
            + ""
            + ".icons-inner {"
            + "text-align: center;"
            + "}"
            + ""
            + ".icons-inner td {"
            + "margin: 0 auto;"
            + "}"
            + ""
            + ".mobile_hide {"
            + "display: none;"
            + "}"
            + ""
            + ".row-content {"
            + "width: 100% !important;"
            + "}"
            + ""
            + ".stack .column {"
            + "width: 100%;"
            + "display: block;"
            + "}"
            + ""
            + ".mobile_hide {"
            + "min-height: 0;"
            + "max-height: 0;"
            + "max-width: 0;"
            + "overflow: hidden;"
            + "font-size: 0px;"
            + "}"
            + ""
            + ".desktop_hide,"
            + ".desktop_hide table {"
            + "display: table !important;"
            + "max-height: none !important;"
            + "}"
            + "}"
            + "</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->"
            + "</head>"
            + "<body class='body' style='background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;'>"
            + "<table class='nl-container' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row row-1' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #333; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='50%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-right: 10px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='image_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:15px;padding-top:15px;width:100%;'>"
            + "<div class='alignment' align='left'>"
            + "<div style='max-width: 290px;'><img src='https://78e5c3ac46.imgdist.com/pub/bfra/42gk87sq/109/wqo/qg0/logo.svg' style='display: block; height: auto; border: 0; width: 100%;' width='290' alt='Image' title='Image' height='auto'></div>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-2' width='50%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-right: 10px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:15px;padding-top:15px;'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;font-weight:700;line-height:1.2;text-align:right;mso-line-height-alt:17px;'>"
            + "<p style='margin: 0; word-break: break-word;'>&nbsp;</p>"
            + "<p style='margin: 0; word-break: break-word;'><strong>" + date + "</strong></p>"
            + "<p style='margin: 0; word-break: break-word;'><strong >Invoice nr: <span>" + invoiceId
            + "</span></strong></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-2' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='divider_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;'>"
            + "<div class='alignment' align='center'>"
            + "<table border='0' cellpadding='0' cellspacing='0' role='presentation' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='divider_inner' style='font-size: 1px; line-height: 1px; border-top: 1px solid #222222;'><span style='word-break: break-word;'>&#8202;</span></td>"
            + "</tr>"
            + "</table>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-3' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: " 
            + "0; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='33.333333333333336%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='10' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#101112;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:left;mso-line-height-alt:19px;'>"
            + "<p style='margin: 0;'><span th:text='${order.name}'><br></span><span th:text=' ${order.surname}'><br></span><span th:text='${order.phone}'></span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-2' width='66.66666666666667%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='10' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#101112;direction:ltr;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:1.2;text-align:right;mso-line-height-alt:19px;'>"
            + "<p style='margin: 0;'>" + order.getCountry() + "<br>" + order.getCity() + "<br>"
            + order.getStreetAddress() + "<br>" + order.getZipCode() + "<br></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-10' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; " 
            + "background-color: #FFFFFF; color: #333; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='66.66666666666667%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:5px;'>"
            + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;'>"
            + "<p style='margin: 0; word-break: break-word;'><strong>TOTAL</strong><br></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-2' width='33.333333333333336%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:5px;padding-left:20px;padding-right:20px;padding-top:5px;'>"
            + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;'>"
            + "<p style='margin: 0; word-break: break-word;'><strong>" + order.getTotalPrice() + "</strong></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-4' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<div class='spacer_block block-1' style='height:50px;line-height:50px;font-size:1px;'>&#8202;</div>"
            + "<table class='image_block block-2' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='pad' style='width:100%;'>"
            + "<div class='alignment' align='center'>"
            + "<div style='max-width: 40px;'><img src='https://d1oco4z2z1fhwp.cloudfront.net/templates/default/60/ecommerce-template_order-confirmed-icon.jpg' style='display: block; height: auto; border: 0; width: 100%;' width='40' alt='Image' title='Image' height='auto'></div>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-5' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 10px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;'>"
            + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:18px;line-height:1.2;text-align:center;mso-line-height-alt:22px;'>"
            + "<p style='margin: 0; word-break: break-word;'><strong><span style='word-break: break-word;'>Thank you for placing your order</span></strong></p>"
            + "<p style='margin: 0; word-break: break-word;'><strong><span style='word-break: break-word;'>with our store!</span></strong></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-6' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #000000; " 
            + "color: #333; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='66.66666666666667%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;'>"
            + "<div style='color:#FFFFFF;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;'>"
            + "<p style='margin: 0; word-break: break-word;'>PRODUCTS</p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-2' width='33.333333333333336%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;'>"
            + "<div style='color:#FFFFFF;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word;'>PRICE</span><br></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + generateProductsTable(order.getOrderItems())
            + "<table class='row row-11' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='divider_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:30px;'>"
            + "<div class='alignment' align='center'>"
            + "<table border='0' cellpadding='0' cellspacing='0' role='presentation' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='divider_inner' style='font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;'><span style='word-break: break-word;'>&#8202;</span></td>"
            + "</tr>"
            + "</table>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-12' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #333; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='50%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='15' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word; color: #000000;'>Guitars</span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "<table class='paragraph_block block-2' width='100%' border='0' cellpadding='15' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word; color: #000000;'>Sound</span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "<table class='paragraph_block block-3' width='100%' border='0' cellpadding='15' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word; color: #000000;'>Accessories</span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-2' width='50%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='15' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word; color: #000000;'>Drums</span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "<table class='paragraph_block block-2' width='100%' border='0' cellpadding='15' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word; color: #000000;'>Microphones</span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "<table class='paragraph_block block-3' width='100%' border='0' cellpadding='15' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word; color: #000000;'>Keyboards</span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-13' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='divider_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:20px;'>"
            + "<div class='alignment' align='center'>"
            + "<table border='0' cellpadding='0' cellspacing='0' role='presentation' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='divider_inner' style='font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;'><span style='word-break: break-word;'>&#8202;</span></td>"
            + "</tr>"
            + "</table>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-14' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #333; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='25%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='5' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word;'><a style='text-decoration: none; color: #000000;' href='facebook.com' target='_blank' rel='noopener'>facebook</a></span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-2' width='25%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='5' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word;'><a style='text-decoration: none; color: #000000;' href='twitter.com' target='_blank' data-mce-href='twitter.com' data-mce-style='text-decoration: none'>twitter</a></span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-3' width='25%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='5' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word;'><a style='text-decoration: none; color: #000000;' href='pinterest.com' target='_blank' data-mce-href='pinterest.com' data-mce-style='text-decoration: none'>pinterest</a></span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "<td class='column column-4' width='25%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='5' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad'>"
            + "<div style='color:#000000;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:center;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word;'><a style='text-decoration: none; color: #000000;' href='instagram.com' target='_blank' data-mce-href='instagram.com' data-mce-style='text-decoration: none'>instagram</a></span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-15' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='divider_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:20px;'>"
            + "<div class='alignment' align='center'>"
            + "<table border='0' cellpadding='0' cellspacing='0' role='presentation' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tr>"
            + "<td class='divider_inner' style='font-size: 1px; line-height: 1px; border-top: 1px dotted #CCCCCC;'><span style='word-break: break-word;'>&#8202;</span></td>"
            + "</tr>"
            + "</table>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "<table class='row row-16' align='center' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;'>"
            + "<tbody>"
            + "<tr>"
            + "<td>"
            + "<table class='row-content stack' align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 620px; margin: 0 auto;' width='620'>"
            + "<tbody>"
            + "<tr>"
            + "<td class='column column-1' width='100%' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;'>"
            + "<table class='paragraph_block block-1' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-left:10px;padding-right:10px;padding-top:10px;'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:left;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word;'>Copyright © 2024 FancyStrings, All rights reserved.&nbsp;</span><br><br></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "<table class='paragraph_block block-2' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-left:10px;padding-right:10px;'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:1.2;text-align:left;mso-line-height-alt:17px;'>"
            + "<p style='margin: 0; word-break: break-word;'>&nbsp;<br></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "<table class='paragraph_block block-3' width='100%' border='0' cellpadding='0' cellspacing='0' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;'>"
            + "<tr>"
            + "<td class='pad' style='padding-bottom:10px;padding-left:10px;padding-right:10px;'>"
            + "<div style='color:#555555;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:12px;line-height:1.2;text-align:left;mso-line-height-alt:14px;'>"
            + "<p style='margin: 0; word-break: break-word;'><span style='word-break: break-word;'>Have questions? Email us at <a href='mailto:fancystrings.org@gmail.com'>fancystrings.org@gmail.com</a></span></p>"
            + "</div>"
            + "</td>"
            + "</tr>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table><!-- End -->"
            + "</body>"
            + "</html>";

        return pdf;

    }

    private OrderLineItems mapToDto(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setProductSkuId(orderLineItemsDto.getProductSkuId());
        orderLineItems.setProductName(orderLineItemsDto.getProductName());
        orderLineItems.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItems.setUnitPrice(orderLineItemsDto.getUnitPrice());
        return orderLineItems;
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("Invalid token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
        }

        String jwtToken = token.substring("Bearer ".length());

        return webClient
                .build()
                .get()
                .uri(variablesConfiguration.getAdminVerificationUrl() + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }
}
