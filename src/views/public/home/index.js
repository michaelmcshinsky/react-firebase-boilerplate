import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import './home.scss';

export default function Home() {
  return (
    <>
      <div id='home-banner' className='bg-primary text-white'>
        <Container className='text-center'>
          <h1>
            <span role='img' aria-label='react'>
              ⚛️
            </span>{' '}
            React Firebase Starter{' '}
            <span role='img' aria-label='firebase'>
              🔥
            </span>
          </h1>
          <p className='lead'>
            A starter kit built to get all your projects off the ground
          </p>
        </Container>
      </div>
      <section id='home-welcome' className='home-section bg-light'>
        <Container>
          <Row>
            <Col sm='12'>
              <Row>
                <Col sm='4'>
                  <div className='text-center'>
                    <div className='features-icon d-flex'>
                      <i className='las la-desktop m-auto text-primary'></i>
                    </div>
                    <h4>Title</h4>
                    <p className='lead mb-0'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </Col>
                <Col sm='4'>
                  <div className='text-center'>
                    <div className='features-icon d-flex'>
                      <i className='las la-layer-group m-auto text-primary'></i>
                    </div>
                    <h4>Title</h4>
                    <p className='lead mb-0'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </Col>
                <Col sm='4'>
                  <div className='text-center'>
                    <div className='features-icon d-flex'>
                      <i className='las la-check-circle m-auto text-primary'></i>
                    </div>
                    <h4>Title</h4>
                    <p className='lead mb-0'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      <section id='home-showcase'>
        <Container fluid className='p-0'>
          <Row noGutters>
            <Col lg={{ size: 6, order: 2 }} className='home-showcase-img'></Col>
            <Col lg={{ size: 6, order: 1 }} className='my-auto px-5'>
              <h2>Why a starter kit?</h2>
              <p className='lead mg-0'>
                Created to help myself and others get projects off the ground
                and running without having to create the same code for every
                project over and over and over and over...
              </p>
            </Col>
          </Row>
          <Row noGutters>
            <Col lg={{ size: 6, order: 1 }} className='home-showcase-img'></Col>
            <Col lg={{ size: 6, order: 2 }} className='my-auto px-5'>
              <h2>A Dash of Opinion</h2>
              <p className='lead mg-0'>
                Some sense of structure is good and so this was built to get the
                job done but not so opinionated that you can't change the flow
                and structure to match your teams needs.
              </p>
            </Col>
          </Row>
          <Row noGutters>
            <Col lg={{ size: 6, order: 2 }} className='home-showcase-img'></Col>
            <Col lg={{ size: 6, order: 1 }} className='my-auto px-5'>
              <h2>What's baked in?</h2>
              <p className='lead mg-0'>
                Firebase, Bootstrap and React are the primary ingredients.
                Everything else is a sprinkling of enhancement to make the
                experience more delightful while not getting in your way.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      https://startbootstrap.com/previews/simple-sidebar/
      <br />
      https://startbootstrap.com/previews/sb-admin-2/
      <br />
      https://startbootstrap.com/previews/landing-page/
    </>
  );
}
