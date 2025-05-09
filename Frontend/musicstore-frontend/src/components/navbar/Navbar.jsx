import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import LocalStorageHelper from "../../helpers/LocalStorageHelper.jsx";
import logo from '../../assets/logo.svg';
import {
    Tooltip,
    Badge,
    Menu,
    MenuItem,
    Button,
    FormControlLabel,
    Switch,
    styled,
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Typography,
    Link,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    InputBase,
    useTheme,
} from '@mui/material';
import {
    SearchOutlined as SearchOutlinedIcon,
    PersonOutlineOutlined as PersonOutlineOutlinedIcon,
    ShoppingCartOutlined as ShoppingCartOutlinedIcon,
    LoginOutlined as LoginOutlinedIcon,
    LogoutOutlined as LogoutOutlinedIcon,
    AdminPanelSettingsOutlined as AdminPanelSettingsOutlinedIcon,
    Settings as SettingsIcon,
    AssignmentOutlined as AssignmentOutlinedIcon,
    Comment as CommentIcon,
    FavoriteBorderOutlined as FavoriteBorderOutlinedIcon
} from '@mui/icons-material';
import {NavLink} from "react-router-dom";
import axios from "axios";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: '100%',
    display: 'block',
    boxSizing: 'border-box',
    margin: '0',
    padding: '0',
    minHeight: '10dvh',
}));

const StyledToolbar = styled(Toolbar)({
    minHeight: '10dvh',
    padding: '1% 10%',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    boxSizing: 'border-box',

});

const StyledSearchForm = styled(Paper)(() => ({
    width: '30%',
    minWidth: '200px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
}));

const StyledSearchInput = styled(InputBase)(({ theme }) => ({
    width: '80%',
    height: '40px',
    margin: 0,
    backgroundColor: theme.palette.background.paper,
    fontSize: '16px',
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '1em',
    padding: '0 10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'border-color 0.3s ease-in-out',
    '&:focus': {
        borderColor: theme.palette.primary.main,
        outline: 'none',
    },
}));

const StyledSearchButton = styled(IconButton)(({ theme }) => ({
    padding: 0,
    width: '40px',
    height: '40px',
    margin: 'auto -10px',
    color: 'white',
    zIndex: 1,
    backgroundColor: theme.palette.irish.main,
    border: `1px solid ${theme.palette.irish.main}`,
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.irish.light,
        borderColor: theme.palette.irish.light,
        color: 'white',
    },
}));

const StyledUserContainer = styled(Box)({
    display: 'flex',
    width: 'fit-content',
    minHeight: '50px',
    height: 'fit-content',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
});

const StyledUserList = styled(List)({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
});

const StyledUserListItem = styled(ListItem)(({ theme }) => ({
    listStyle: 'none',
    position: 'relative',
    color: theme.palette.text.primary,
    margin: '0 10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    fontSize: '12px',
    fontWeight: 'bold',
    width: 'fit-content',
    height: 'fit-content',
    minWidth: '20px',
    minHeight: '0',
    padding: 0,
    height: '50px',
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.shadowLink.main,
    transition: 'background-color 0.3s ease-in-out',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        backgroundColor: theme.palette.shadowLink.main,
        color: theme.palette.text.primary,
    },
    '&:focus': {
        outline: 'none !important',
        border: 'none !important',
    },
    '&:active': {
        border: 'none !important',
        outline: 'none !important',
    },
}));

const StyledBottomContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    height: '2dvh',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default,
    padding: '1% 10%',
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderTop: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
}));

const StyledCategoryList = styled(List)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
});

const StyledCategoryItem = styled(ListItem)({
    listStyle: 'none',
    margin: 0,
    padding: '0 15px',
    position: 'relative',
});

const StyledCategoryLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'normal',
    color: theme.palette.text.primary,
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
        color: theme.palette.text.secondary,
        textDecoration: 'none',
    },
    '&.active': {
        fontWeight: 'bold',
        color: theme.palette.text.secondary,
    },
}));

const StyledAccountButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    borderRadius: '1em',
    boxShadow: '0 5px 15px ' + theme.palette.shadowLink.main,
    transition: 'background-color 0.3s ease-in-out',
    textAlign: 'left',
    '&:hover': {
        backgroundColor: theme.palette.shadowLink.main,
    },
    '&:focus': {
        outline: 'none !important',
        border: 'none !important',
    },
    '&:active': {
        border: 'none !important',
        outline: 'none !important',
    },
}));

function Navbar() {
    const [search, setSearch] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [categories, setCategories] = React.useState([]);
    const [basketCount, setBasketCount] = React.useState(parseInt(0));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [checked, setChecked] = React.useState(localStorage.getItem('theme') === 'dark' ? true : false);

    const handleCheck = (e) => {
        setChecked(checked ? false : true);
        checked ? localStorage.setItem('theme', 'light') : localStorage.setItem('theme', 'dark');
        window.dispatchEvent(new Event('theme'));
        handleClose();
    }

    const theme = useTheme();

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                        '#fff',
                    )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#aab4be',
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#8796A5',
                    }),
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: '#001e3c',
            width: 32,
            height: 32,
            '&::before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: '#003892',
            }),
        },
        '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: '#aab4be',
            borderRadius: 20 / 2,
            ...theme.applyStyles('dark', {
                backgroundColor: '#8796A5',
            }),
        },
    }));

    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setUserName(LocalStorageHelper.getUserName());
    }, []);

    window.addEventListener('storage', () => {
        setUserName(LocalStorageHelper.getUserName());
    });

    window.addEventListener('basket', () => {
        setBasketCount(parseInt(LocalStorageHelper.getBasketItems().toString()));
    })

    window.addEventListener('category', () => {
        axios.get('api/products/categories/get')
            .then(res => {
                setCategories(res.data);
            }).catch(() => {})
    })

    useEffect(() => {
        setBasketCount(LocalStorageHelper.getBasketItems().toString());
    }, [])

    useEffect(() => {
        axios.get('api/products/categories/get')
            .then(res => {
                setCategories(res.data);
            }).catch(() => {})
    }, []);

    const logoutUser = () => {
        LocalStorageHelper.LogoutUser();
        navigate('/');
    }

    const onSubmitSearch = (e) => {
        e.preventDefault();
        navigate(`/products/search/${search}`)
    }

    return (
        <StyledAppBar position="static" elevation={0}>
            <Box sx={{ width: '100%', height: 'fit-content', boxSizing: 'border-box', margin: '0', padding: '0' }}>
                <StyledToolbar disableGutters>
                        <Link component={NavLink} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box component="img" src={logo} alt="Fancy Strings Logo" sx={{ height: '100%' }} />
                        </Link>
                        <StyledSearchForm elevation={0} component="form" onSubmit={onSubmitSearch}>
                            <StyledSearchInput
                                placeholder="Search products"
                                value={search}
                                elevation={0}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <StyledSearchButton type="submit">
                                <SearchOutlinedIcon />
                            </StyledSearchButton>
                        </StyledSearchForm>
                    <StyledUserContainer>
                        <StyledUserList>
                            {LocalStorageHelper.IsUserLogged() && (
                                <StyledUserListItem>
                                    <StyledAccountButton
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                        endIcon={<PersonOutlineOutlinedIcon />}
                                    >
                                        <Typography variant="body2" sx={{ maxWidth: '50px', overflow: 'hidden', fontSize: '10px',
 }}>
                                            Hi,<br/>{userName}
                                        </Typography>
                                    </StyledAccountButton>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    borderRadius: '1em',
                                                    width: "180px",
                                                    marginTop: "2px",
                                                    padding: '4px',
                                                    fontSize: '10px',
                                                }
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={() => {handleClose(); navigate("/account")}}>
                                            <ListItemIcon><SettingsIcon fontSize='small'/></ListItemIcon>
                                            <ListItemText>My account</ListItemText>
                                        </MenuItem>
                                        <MenuItem onClick={() => {handleClose(); navigate("/myorders")}}>
                                            <ListItemIcon><AssignmentOutlinedIcon fontSize='small'/></ListItemIcon>
                                            <ListItemText>My orders</ListItemText>
                                        </MenuItem> 
                                        <MenuItem onClick={() => {handleClose(); navigate("/myratings")}}>
                                            <ListItemIcon><CommentIcon fontSize='small'/></ListItemIcon>
                                            <ListItemText>My opinions</ListItemText>
                                        </MenuItem>
                                        <MenuItem onClick={() => {handleClose(); navigate("/favourites")}}>
                                            <ListItemIcon><FavoriteBorderOutlinedIcon fontSize='small'/></ListItemIcon>
                                            <ListItemText>Favorites</ListItemText>
                                        </MenuItem>
                                        <MenuItem sx={{borderBottom: '1px solid ' + theme.palette.divider, }}>
                                            <FormControlLabel
                                                control={<MaterialUISwitch checked={checked} onChange={handleCheck} />}
                                            />
                                        </MenuItem>
                                        {LocalStorageHelper.IsUserLogged() && (
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <Link component={NavLink} onClick={logoutUser}><LogoutOutlinedIcon fontSize='small'/></Link>
                                                </ListItemIcon>
                                                <ListItemText>Logout</ListItemText>
                                            </MenuItem>
                                        )}
                                    </Menu>
                                </StyledUserListItem>
                            )}

                            {!LocalStorageHelper.IsUserLogged() && (
                                <StyledUserListItem>
                                    <Tooltip title="Login">
                                        <Link component={NavLink} to="/login" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ mr: 1, textAlign: 'left', fontSize: '10px',
 }}>
                                                Hi!<br/>Log in
                                            </Typography>
                                            <PersonOutlineOutlinedIcon />
                                        </Link>
                                    </Tooltip>
                                </StyledUserListItem>
                            )}

                            <StyledUserListItem>
                                <Tooltip title="Basket">
                                    <Link component={NavLink} to="/basket">
                                        <Badge badgeContent={basketCount} showZero color={'irish'}>
                                            <ShoppingCartOutlinedIcon fontSize='small'/>
                                        </Badge>
                                    </Link>
                                </Tooltip>
                            </StyledUserListItem>

                            {LocalStorageHelper.IsUserLogged() && (
                                <StyledUserListItem>
                                    <Tooltip title="Favourites">
                                        <Link component={NavLink} to="/favourites">
                                            <FavoriteBorderOutlinedIcon fontSize='small'/>
                                        </Link>
                                    </Tooltip>
                                </StyledUserListItem>
                            )}

                            {LocalStorageHelper.isUserAdmin() && (
                                <StyledUserListItem>
                                    <Tooltip title="Admin panel">
                                        <Link component={NavLink} to="/admin/category" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', "&:hover": { textDecoration: 'none' } }}>
                                            <Typography variant="body2" sx={{ mr: 1, fontSize: '10px' }}>
                                                Admin<br/>panel
                                            </Typography>
                                            <AdminPanelSettingsOutlinedIcon fontSize='small'/>
                                        </Link>
                                    </Tooltip>
                                </StyledUserListItem>
                            )}

                            {!LocalStorageHelper.IsUserLogged() && (
                                <StyledUserListItem>
                                    <Tooltip title="Login">
                                        <Link component={NavLink} to="/login">
                                            <LoginOutlinedIcon fontSize='small'/>
                                        </Link>
                                    </Tooltip>
                                </StyledUserListItem>
                            )}

                            {/* {LocalStorageHelper.IsUserLogged() && (
                                <StyledUserListItem>
                                    <Tooltip title="Logout">
                                        
                                    </Tooltip>
                                </StyledUserListItem>
                            )} */}
                        </StyledUserList>
                    </StyledUserContainer>
                </StyledToolbar>

                <StyledBottomContainer elevation={0}>
                    <StyledCategoryList>
                        {categories.map((cat) => (
                            <StyledCategoryItem key={cat.id}>
                                <StyledCategoryLink component={NavLink} to={`/products/${cat.id}/${cat.name}`}>
                                    {cat.name}
                                </StyledCategoryLink>
                            </StyledCategoryItem>
                        ))}
                    </StyledCategoryList>
                </StyledBottomContainer>
            </Box>
        </StyledAppBar>
    );
}

export default Navbar;