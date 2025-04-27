import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { styled } from '@mui/material/styles';
import {
    Rating,
    Button
} from "@mui/material";
import React, {useState} from "react";
import LocalStorageHelper from "../../../helpers/LocalStorageHelper.jsx";


function Opinion( {opinion} ) {

    const [myHeight, setMyHeight] = useState('36px');

    const changeHeight = () => {
        setMyHeight(myHeight === '36px' ? 'fit-content' : '36px');
    }

    const generateRating = (rating) => {
        if (rating === 'ONE') {
            return 1;
        } else if (rating === 'TWO') {
            return 2;
        } else if (rating === 'THREE') {
            return 3;
        } else if (rating === 'FOUR') {
            return 4;
        } else if (rating === 'FIVE') {
            return 5;
        }
    }

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#ff6d75',
        },
        '& .MuiRating-iconHover': {
          color: '#ff3d47',
        },
    });


    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '60%',
                minWidth: '300px',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: '30%',
                    height: 'fit-content',
                    padding: '8px',
                }}
            >
                <Box sx={{ '& > legend': { mt: 2 } }}>
                <StyledRating
                    name="customized-color"
                    value={generateRating(opinion.rating)}
                    getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                    precision={0.5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    readOnly
                    size="small"
                />
                </Box>
                <p style={{margin: '0', fontSize: '16px', fontWeight: 'bold'}}>{parseFloat(generateRating(opinion.rating)).toFixed(1)}/5.0</p>
                {
                    opinion.username === LocalStorageHelper.getUserName() ?
                    <p style={{margin: '0', fontSize: '16px', fontWeight: 'bold', color: 'rgb(39, 99, 24)'}}>{opinion.username}</p>
                    :
                    <p style={{margin: '0', fontSize: '16px', fontWeight: 'bold'}}>{opinion.username}</p>
                }
                    
                
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
            }}>
                <p style={{margin: '0', padding: '8px', fontSize: '16px', fontWeight: 'normal', textWrap: 'wrap', overflow: 'hidden', height: myHeight}}>{opinion.comment}</p>
                <div 
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        height: 'fit-content',
                        marginTop: '8px',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                    }}
                >
                    {myHeight === '36px' && 
                    <Button
                        variant="text"
                    onClick={changeHeight} 
                    sx={{
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        height: myHeight,
                        borderColor: 'rgb(39, 99, 24)',
                        color: 'rgb(39, 99, 24)',
                       outline: 'none !important',
                        "&:focus": {
                            bordeerColor: 'rgba(49,140,23, 0.1)', 
                            outline: 'none !important',
                        },
                        "&:hover": { 
                            borderColor: 'rgba(49,140,23, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(49,140,23)',
                            outline: 'none !important',

                        }
                    }}>Show more</Button>
                }
                {myHeight === 'fit-content' && 
                    <Button
                    variant='text' 
                    onClick={changeHeight}
                    sx={{
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        borderColor: 'rgb(39, 99, 24)',
                        color: 'rgb(39, 99, 24)',
                        outline: 'none !important',
                        "&:focus": {
                            bordeerColor: 'rgba(49,140,23, 0.1)', 
                            outline: 'none !important',
                        },
                        "&:hover": { 
                            borderColor: 'rgba(49,140,23, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(49,140,23)',
                            outline: 'none !important',

                        }
                    }}>Hide</Button>
                } 
                </div>
                
            </div>
        </div>
    );
}

export default Opinion;