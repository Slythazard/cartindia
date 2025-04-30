import React, { useState, useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import './css/HeroSec.css';
import {API_URL} from "../../constants"


const SamplePrevArrow = props => {
  const { className, onClick, style } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: 'block!important',
      }}
      onClick={onClick}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        height='50px'
        viewBox='0 -960 960 960'
        width='50px'
        fill='black'
      >
        <path d='M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z' />
      </svg>
    </div>
  );
};

const SampleNextArrow = props => {
  const { className, onClick, style } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: 'block!important',
      }}
      onClick={onClick}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        height='50px'
        viewBox='0 -960 960 960'
        width='50px'
        fill='black'
      >
        <path d='m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z' />
      </svg>
    </div>
  );
};

function HeroSec() {
  const [offersData, setOffersData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/carousel-data`)
      .then(res => res.json())
      .then(data => {
        console.log('Offers:', data);
        setOffersData(data);
      })
      .catch(err => console.error('Failed to fetch offers:', err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: dots => (
      <div
        style={{ position: 'absolute!important', top: '4rem!important', width: '100%!important', zIndex: 10 + "!important" }}
      >
        <ul
          style={{ display: 'flex!important', justifyContent: 'center!important', gap: '0.5rem!important' }}
        >
          {dots}
        </ul>
      </div>
    ),
    customPaging: i => (
      <div className='custom-paging '
      >
        <svg
          className='dot-default'   
          xmlns='http://www.w3.org/2000/svg'
          height='16'   
          viewBox='0 0 24 24'
          width='16'
          fill='#9ca3af'
        >
          <circle cx='12' cy='12' r='6' />
        </svg>
        <svg
          className='dot-hover'
          xmlns='http://www.w3.org/2000/svg'
          height='16'
          viewBox='0 0 24 24'
          width='16'
          fill='#000000!important'
        >
          <path d='M12 2a10 10 0 100 20 10 10 0 000-20z' />
        </svg>
      </div>
    )
  };

  return (
    <div className="hero-container">
  <Slider {...settings}>
    {offersData.map(item => (
      <div className="hero-slide" key={item.id}>
        <img src={item.image} alt={item.name} />
        <h1 className="hero-title">{item.offer_type}</h1>
        <h3 className="hero-subtitle">{item.offer_details}</h3>
      </div>
    ))}
  </Slider>
</div>
  );
}

export default HeroSec;
