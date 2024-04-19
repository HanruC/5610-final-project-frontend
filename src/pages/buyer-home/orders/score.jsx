import React from 'react';
import {Container} from "react-bootstrap";
import {useState} from "react";

function Score({handleScore}) {
    let max = 5;
    const [val, setVal] = useState(3);
    const renderStars = () => {
        let stars = [];
        for (let index = 0; index < max; index ++) {
            let iconName;
            if (index < val) {
                iconName = 'bi bi-star-fill me-1';
            } else {
                iconName = 'bi bi-star me-1'
            }
            stars.push(<i
                className={iconName}
                style={{fontSize: '30px', cursor: 'pointer', color: 'orange'}}
                key={index + 1}
                onClick={() => {
                    setVal(index + 1);
                    handleScore(index + 1)
                }
                }></i>)
        }
        return stars;
    }
    return <Container>
        {renderStars()}
    </Container>
}

export  default  Score;
