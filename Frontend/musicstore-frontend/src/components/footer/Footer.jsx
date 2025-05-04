import { Box, Typography, styled} from '@mui/material';

const FooterWrapper = styled(Box)(() => ({
    height: 'fit-content',
    width: '100%',
    padding: 0,
    margin: 0,
    minHeight: '10dvh',
}));

const FooterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '10dvh',
    height: 'fit-content',
    margin: 0,
    padding: '0 20%',
    borderTop: '1px solid ' + theme.palette.divider,
    backgroundColor: theme.palette.background.default,
}));

const LeftContainer = styled(Box)(({ theme }) => ({
    display: 'block',
    alignItems: 'start',
    justifyContent: 'start',
    color: theme.palette.text.primary,
    fontSize: '12px',
    padding: '3vh 0',
    margin: 0,
    height: '100%',
}));

const RightContainer = styled(Box)(({ theme }) => ({
    display: 'block',
    alignItems: 'start',
    justifyContent: 'start',
    color: theme.palette.text.primary,
    fontSize: '12px',
    padding: '3vh 0',
    margin: 0,
    height: '100%',
}));

const FooterTitle = styled(Typography)(() => ({
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
}));

const FooterText = styled(Typography)(() => ({
    fontSize: '12px',
    lineHeight: '1.5',
}));

function Footer() {
    return (
        <FooterWrapper>
            <FooterContainer>
                <LeftContainer>
                    <FooterTitle variant="h5">About us</FooterTitle>
                    <FooterText>
                        We are a project dedicated to bachelor&apos;s<br />
                        degree thesis focused on microservices web<br />
                        applications.
                    </FooterText>
                </LeftContainer>
                <RightContainer>
                    <FooterTitle variant="h5">Contact</FooterTitle>
                    <FooterText>E-mail: fancy.strings.org@gmail.com</FooterText>
                </RightContainer>
            </FooterContainer>
        </FooterWrapper>
    );
}

export default Footer;