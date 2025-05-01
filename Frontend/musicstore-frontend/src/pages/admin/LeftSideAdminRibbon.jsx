import {NavLink} from "react-router-dom";
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import {Box, Typography, List, ListItem, styled} from "@mui/material";

const AdminRibbonContainer = styled(Box)(({theme}) => ({
    padding: 0,
    height: 'fit-content',
    width: '300px',
    minWidth: '200px',
    minHeight: '80vh',
    overflow: 'hidden',
    margin: '16px 0 0 0',
    [theme.breakpoints.down('sm')]: {
        display: 'none !important'
    }
}));

const WelcomeText = styled(Typography)(({theme}) => ({
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(1.75),
}));

const MenuList = styled(List)(({theme}) => ({
    display: 'block',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 0,
    padding: 0,
}));

const MenuItem = styled(ListItem)(({theme}) => ({
    listStyle: 'none',
    margin: 0,
    padding: theme.spacing(1.875),
    position: 'relative',
}));

const MenuLink = styled(NavLink)(({theme}) => ({
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'normal',
    color: theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
        color: 'rgb(184, 184, 184)',
        cursor: 'pointer',
    },
    '&.active': {
        fontWeight: 'bold',
    },
}));

function LeftSideAdminRibbon() {
    return (
        <AdminRibbonContainer>
            <WelcomeText variant="h4">
                Welcome to<br/>Admin panel
            </WelcomeText>
            <MenuList>
                <MenuItem>
                    <MenuLink to="/admin/category">
                        <CategoryOutlinedIcon fontSize="medium"/>
                        Categories
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/admin/country">
                        <LanguageOutlinedIcon fontSize="medium"/>
                        Countries
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/admin/manufacturer">
                        <WarehouseOutlinedIcon fontSize="medium"/>
                        Manufacturers
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/admin/order">
                        <AssignmentOutlinedIcon fontSize="medium"/>
                        Orders
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/admin/product">
                        <Inventory2OutlinedIcon fontSize="medium"/>
                        Products
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/admin/subcategory">
                        <TurnedInNotOutlinedIcon fontSize="medium"/>
                        Subcategories
                    </MenuLink>
                </MenuItem>
            </MenuList>
        </AdminRibbonContainer>
    );
}

export default LeftSideAdminRibbon;