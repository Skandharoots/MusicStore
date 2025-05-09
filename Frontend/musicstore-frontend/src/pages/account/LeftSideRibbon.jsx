import {Box, Typography, List, ListItem, styled} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import {NavLink} from "react-router-dom";
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const LeftSideContainer = styled(Box)(({theme}) => ({
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
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '16px',
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

function LeftSideRibbon() {
    return (
        <LeftSideContainer>
            <MenuList>
                <MenuItem>
                    <MenuLink to="/myorders">
                        <AssignmentOutlinedIcon fontSize="medium"/>
                        My Orders
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/basket">
                        <ShoppingCartOutlinedIcon fontSize="medium"/>
                        My Basket
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/myratings">
                        <CommentIcon fontSize="medium"/>
                        Opinions
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/favourites">
                        <FavoriteBorderOutlinedIcon fontSize="medium"/>
                        Favorites
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/account">
                        <SettingsIcon fontSize="medium"/>
                        Account settings                    
                    </MenuLink>
                </MenuItem>
            </MenuList>
        </LeftSideContainer>
    );
}

export default LeftSideRibbon;