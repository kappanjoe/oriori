import React from 'react';

import { useState, useEffect } from 'react';
import './Card.css';

type  Props = {
    className: string | undefined, 
    productName: string,
    img_url: string | undefined,
    offerStart: string,
    offerEnd: string, 
    favoriteNumber: number, 
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
    
}

const availability = [
    {value:0, text:"Coming Soon"},
    {value:1, text:"Fresh Item!"},
    {value:2, text:"Available Now!"},
    {value:3, text:"Ending Soon"},
    {value:4, text:"Expired"}
]

const Card :React.FC<Props> = ({className, img_url, productName, offerStart, offerEnd, favoriteNumber, onClick}) => {

    
    const current :Date = new Date();
    const currentYear: number = current.getFullYear();
    const currentMonth: string = (current.getMonth() + 101).toString().substring(1);
    const currentDate:string = (current.getDate() + 100).toString().substring(1);
    const [ offerEnds, setOfferEnds ] = useState<string>(offerEnd);
    const [ offerStarts, setOfferStarts ] = useState<string>(offerStart);
    useEffect(()=> {
        if(offerEnds === "null" || offerEnds === "undefined"){
            setOfferEnds(`${(currentYear + 100).toString()}-${currentMonth}-${currentDate}`);
        }
        if(offerStarts === "undefined" || offerStarts === "null"){
            setOfferStarts(`${currentYear}-${currentMonth}-${currentDate}`)
        }
        
    }, []);
    
    
    // For card color 
    const offerEndDate: Date = new Date(offerEnds);
    const offerStartDate: Date = new Date(offerStarts);
    const oneDay: number = 24 * 60 * 60 * 1000;
    const diffInEndDays: number = Math.round(Math.abs((offerEndDate.getTime() - current.getTime()) / oneDay));
    const diffInStartDays: number = Math.round(Math.abs((offerStartDate.getTime() - current.getTime()) / oneDay));
    const diffInStartAndEndDays: number = Math.round(Math.abs((offerEndDate.getTime() - offerStartDate.getTime()) / oneDay)); // promotion period date

    

    console.log("🤡 productName:", productName);
    console.log("👋 offerEndDate:", offerEndDate);
    console.log("💚 offerStartDate:", offerStartDate);
    console.log("🙀 offerEnds:", offerEnds, "day");
    console.log("💗 offerStarts:", offerStarts, "day");
    console.log("😆 diffInEndDays:",diffInEndDays, "days");
    console.log("🥵 diffInStartDays:",diffInStartDays, "day");
    console.log("👿 diffInStartAndEndDays:",diffInStartAndEndDays, "day");
    const normalBgcolor = "grey";
    const freshItemBgcolor = "paleturquoise";
    const lastDayBgcolor = "red";
    const [ bgcolor, setBgcolor ] = useState<string>(normalBgcolor);
    // const [isPromotionPeriod, setIsPromotionPeriod] = useState<boolean>(false);
    const [isStartThreeDays, setIsStartThreeDays ] = useState<boolean>(false);
    const [isLastWeek, setIsLastWeek] = useState<boolean>(false); 

    // if(diffInEndDays > 0){ // when this is not zero
    //     setIsPromotionPeriod(true);
    //     setIsLastWeek(true);
    // }

    const styles = {
        backgroundColor: bgcolor
    };
    useEffect(() => {
        // handle card color
        // Is it the promotion period yet? is it within the promotion period? is it outside the promotion period?
        if(diffInStartAndEndDays< 11){
            if(diffInStartAndEndDays < 1){
                // grey, 1 x red, grey 
                // no middle grey, no green
                // 1 block only - current day = red
            } else if (diffInStartAndEndDays < 8 ){
                // grey, 1-7x red, grey
                // no middle grey, no green
                // 7 block only
            } else { 
                //(diffInStartAndEndDays < 11)
                // grey, 1-3x green, 7x red, grey
                // might overlap with green, when green does overlap with red, red prevail
            }
        } else if (diffInStartAndEndDays >= 11){
            // grey, 3x green, any number of grey, 7x red, grey
        }
        

    }, []);
    
    
    const handleFavorite: ()=> void = () => {
        // fixme: how do we check if user has favour the card already or not?
        if(!addLove){
            setCounter(counter + 1);
            setAddLove(true);
        } else {
            setCounter(counter - 1);
            setAddLove(false);
        }
    }
    
    const [ addLove, setAddLove ] = useState<boolean>(false);
    const [ counter, setCounter ] = useState<number>(favoriteNumber);
    
    // For card message
    const [ availableMessage, setAvailableMessage ] = useState<string>(availability[0].text);
    


    return (
        <div>
            <div className="cardName" 
            // onLoad={handleOffer}
            style={styles}
            >
                <div className="imageURL">
                    { (img_url) ? <><img src={img_url} alt={img_url} /></> : <></> }
                </div>
                <div className="productName">
                    {productName}
                </div>
                <div className="offerStart">
                    {`Offer start in : ${offerStart}`}
                </div>
                <div className="offerEnd">
                    {`Offer end in : ${offerEnd}`}
                </div>
                <div className="availableMessage">
                    {`${availableMessage}`}
                </div>
                <div className="favoriteNumber">
                    <button
                    className="favoriteAdd"
                    onClick={handleFavorite}
                    >{`❤️ ${counter}`}
                    </button>
                   
                    
                </div>
            </div>
        </div>

    )
}

export default Card;