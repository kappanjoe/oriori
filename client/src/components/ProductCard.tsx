import React, { useState } from 'react';
import axios from 'axios';
import { UserAuth } from '../context/AuthContext';
import { UserBkmarks } from '../context/BkmarkContext';
import { UserLogs } from '../context/LogContext';
import BkmarkButton from './BkmarkButton';
import LikeButton from './LikeButton';
import LogButton from './LogButton';

// import '../styles/Card.css';
// import '../styles/Container.css';
// import '../styles/Fonts.css';
// import '../styles/Icons.css';
// import '../styles/Button.css';
// import '../styles/Images.css';

import '../styles/ProductCard.css';

type  Props = {
  product: Product,
  bookmark?: Bookmark,
  log?: Log
};


function ProductCard ({ product, bookmark, log }: Props) {
  const auth = UserAuth();
  const { addBkmark, removeBkmark } = UserBkmarks();
  const { addLog, editLog, removeLog } = UserLogs();
  const [isBookmark, setIsBookmark] = useState(bookmark ? true : false);
  const [isLogged, setIsLogged] = useState(log ? true : false);
  const [isLiked, setIsLiked] = useState(log?.liked_it ? true : false);

  let availabilityMsg = 'No availability info.';
  
  const currentDate: Date = new Date();
  const currentDateNum = currentDate.getTime();
  const oneDay: number = 24 * 60 * 60 * 1000;
  let availModifier = '';

  if (product.start_date) {
    const offerStartDate: Date = new Date(product.start_date);
    const offerStartNum = offerStartDate.getTime();
    const daysSinceStart: number = Math.floor((currentDateNum - offerStartNum) / oneDay);
    
    availabilityMsg = `Available on ${offerStartDate.toLocaleDateString()}`;
  
    
    if (daysSinceStart >= 0) {
      availabilityMsg = 'Now available!';
      if (daysSinceStart < 4) {
        availModifier += ' new'
      }
    }
  }

  if (product.end_date) {
    const offerEndDate: Date = new Date(product.end_date);
    const offerEndNum = offerEndDate.getTime();
    const daysBeforeEnd: number = Math.ceil((offerEndNum - currentDateNum) / oneDay);

    if (daysBeforeEnd >= 0) {
      if (daysBeforeEnd < 6) {
        availModifier += ' ending';
        availabilityMsg = `Only available for ${daysBeforeEnd} days!`;
      } else {
        availabilityMsg = `Available until ${offerEndDate.toLocaleDateString()}`;
      }
    } else {
      availabilityMsg = 'No longer available.';
    }
  }

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': auth?.csrftoken ?? ''
  };

  const addBkmarkHandler = () => {
    axios.post(`/api/users/${auth?.user.uuid}/bookmarks/new/`,
      { product: product.id },
      { headers: headers }
    )
    .then((response) => {
      addBkmark(response.data);
    })
    .catch((err) => console.log('😈', err));
  };

  const deleteBkmarkHandler = () => {
    axios.delete(`/api/users/${auth?.user.uuid}/bookmarks/${bookmark!.id}/deletion/`,
      { headers: headers }
    )
    .then(() => {
      removeBkmark(bookmark!.product);
    })
    .catch((err) => console.log('😈', err));
  };
  
  const clickBkmarkHandler: React.MouseEventHandler<HTMLDivElement> = () => {
    if (isBookmark) {
      deleteBkmarkHandler();
    } else {
      addBkmarkHandler();
    }
    setIsBookmark(!isBookmark);
  };

  const addLogHandler = () => {
    axios.post(`/api/users/${auth?.user.uuid}/logs/new/`,
      { product: product.id },
      { headers: headers }
    )
    .then((response) => {
      addLog(response.data);
    })
    .catch((err) => console.log('😈', err));
  };

  const deleteLogHandler = () => {
    axios.delete(`/api/users/${auth?.user.uuid}/logs/${log!.id}/deletion/`,
      { headers: headers }
    )
    .then(() => {
      removeLog(log!.product);
      setIsLiked(false);
    })
    .catch((err) => console.log('😈', err));
  };

  const clickLogHandler: React.MouseEventHandler<HTMLDivElement> = () => {
    if (isLogged) {
      deleteLogHandler();
    } else {
      addLogHandler();
    }
    setIsLogged(!isLogged);
  };

  const clickLikeHandler: React.MouseEventHandler<HTMLDivElement> = () => {
    const workingLog = log!;
    workingLog.liked_it = !isLiked;
    editLog(workingLog);
    setIsLiked(!isLiked);
  };

  const clickProductHandler: React.MouseEventHandler<HTMLDivElement> = () => {
    if (product.link_url) {
      window.open(product.link_url, '_blank');
    }
  };

  return (
    <div className='product__card'>
      <div className='product__title' onClick={ clickProductHandler }>
        <h2 className='product__name'>
          { product.product_name }
        </h2>
        <div className={ 'product__avail-container' + availModifier }>
          <p className={ 'product__avail-text' + availModifier }>
            { availabilityMsg }
          </p>
        </div>
      </div>
      <div className='product__content'>
        <div className='product__img-container' onClick={ clickProductHandler }>
          { product.img_url ? <img className='product__img' src={ product.img_url } alt={ product.product_name }/> : <></> }
        </div>
        <div className='product__button-container'>
          <BkmarkButton isBookmark={ isBookmark } clickHandler={ clickBkmarkHandler }/>
          <LogButton isLogged={ isLogged } clickHandler={ clickLogHandler }/>
          { isLogged && <LikeButton isLiked={ isLiked } clickHandler={ clickLikeHandler }/> }
        </div>
      </div>
    </div>
  );
}

export default ProductCard;