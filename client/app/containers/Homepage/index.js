/**
 *
 * Homepage
 *
 */

import React from 'react';
import HeroSec from './morderCarousel.jsx';
import RandomHomepageProduct from './randomProducts.jsx';
import './css/homepage.css';

import { connect } from 'react-redux';
import { Container } from 'reactstrap';
// import { Row, Col } from 'reactstrap';

// import actions from '../../actions';
// import banners from './banners.json';
// import CarouselSlider from '../../components/Common/CarouselSlider';
// import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';

class Homepage extends React.PureComponent {
  render() {
    return (
      <Container className='homepage-container'>
        <HeroSec />
        <RandomHomepageProduct />
        {/* <Row className='flex-row'>
          <Col xs='12' lg='6' className='order-lg-2 mb-3 px-3 px-md-2'>
            <div className='home-carousel'>
              <CarouselSlider
                swipeable={true}
                showDots={true}
                infinite={true}
                autoPlay={false}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img key={index} src={item.imageUrl} />
                ))}
              </CarouselSlider>
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-1 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-5.jpg' />
            </div>
          </Col>
          <Col xs='12' lg='3' className='order-lg-3 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img src='/images/banners/banner-2.jpg' className='mb-3' />
              <img src='/images/banners/banner-6.jpg' />
            </div>
          </Col>
        </Row> */}
      </Container>
    );
  }
}

// const mapStateToProps = state => {
//   return {};
// };

// export default connect(mapStateToProps, actions)(Homepage);
export default Homepage;
