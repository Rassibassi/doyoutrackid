import React, { forwardRef, useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import axios from 'axios';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import { getDay, } from 'date-fns'

import "react-datepicker/dist/react-datepicker.css";

const App = () => {  
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Live} />
        <Route exact path='/archive' component={Archive} />
      </Switch>
    </Router>
  );
}

const Navigation = () => {
  const [toggle, setToggle] = useState(false);
  const untoggle = () => {
    setToggle(false);
  }
  return (
    <nav className="navbar is-link">
      <div className="navbar-brand">
        <button
          onClick={() => {
            setToggle(!toggle)
          }}
          className="navbar-burger"
          data-target="navMenu"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div id="navMenu" className={`navbar-menu${toggle ? ' is-active' : ''}`}>
        <div className="navbar-start">
          <Link
            onClick={untoggle}
            className="navbar-item"
            to='/'
          >
            Live
          </Link>
          <Link
            onClick={untoggle}
            className="navbar-item"
            to='/archive'
          >
            Archive
          </Link>
        </div>
      </div>
    </nav>
  );
}

const Live = () => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(undefined);

  const getTrackIds = (timeoutMs) => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_SERVICE_URL}/today`)
    .then((res) => {
      const tracks = res.data.tracks;

      // console.log(tracks);
      
      // some delay to avoid spamming clicks on the refresh button
      timeoutRef.current = setTimeout(() => {
        setTracks(tracks);
        setIsLoading(false);
        timeoutRef.current = undefined;
      }, timeoutMs);
    })
    .catch((err) => {
      console.log(err);

      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        timeoutRef.current = undefined;
      }, timeoutMs);
    });
  };

  useEffect(() => {
    getTrackIds(200);
    return () => {
      if(timeoutRef.current !== undefined){
        // handle memory leak
        clearTimeout(timeoutRef.current);
      }
    }
  }, []);

  return (
    <>
      <Navigation />
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <article className="media">
                  <div className="media-left">
                    <figure className="image is-128x128">
                      <img alt="Banana" src={process.env.REACT_APP_BANANA_URL} />
                    </figure>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <h1 className="has-text-link">
                        Do!! You!!!
                        <br />
                        Track ID
                      </h1>
                      <p>
                        <small>
                          Find source code here:
                          <br />
                          <a href={process.env.REACT_APP_GITHUB_LINK} target="_blank" rel="noreferrer">
                            Github
                          </a>
                          <br />
                          Give some feedback, email me here:
                          <br />
                          <a href={`mailto:${process.env.REACT_APP_EMAIL}?subject=DoYouTrackID`}>
                            {process.env.REACT_APP_EMAIL}
                          </a>
                        </small>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
              <button
                className={`button is-link is-fullwidth mb-5${isLoading ? " is-loading" : ""}`}
                onClick={() => {getTrackIds(1000)}}
              >
                Refresh
              </button>
              {tracks.map((track, i) => <Box key={i} {...track} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
};

const Archive = (props) => {
  const [tracks, setTracks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(undefined);

  const ButtonInput = forwardRef(({ value, onClick }, ref) => (
    <button
      className={`button is-link is-fullwidth mb-5${isLoading ? " is-loading" : ""}`}
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  ));

  const getTrackIds = (dateString, timeoutMs) => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_SERVICE_URL}/archive/${dateString}`)
    .then((res) => {
      const tracks = res.data.tracks;

      // console.log(tracks);
      
      // some delay to avoid spamming
      timeoutRef.current = setTimeout(() => {
        setTracks(tracks);
        setIsLoading(false);
        timeoutRef.current = undefined;
      }, timeoutMs);
    })
    .catch((err) => {
      console.log(err);

      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        timeoutRef.current = undefined;
      }, timeoutMs);
    });
  };

  const handleDateChange = (date) => {
    const dateString = Moment(date).format("DD/MM/YYYY")
    getTrackIds(dateString, 1000);
    setSelectedDate(date);
  }

  useEffect(() => {
    const dateString = Moment(selectedDate).format("DD/MM/YYYY")
    getTrackIds(dateString, 200);
    return () => {
      if(timeoutRef.current !== undefined){
        // handle memory leak
        clearTimeout(timeoutRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValidDay = (date) => {
    const today = new Date();
    const startDay = new Date(2021, 9, 25);
    const day = getDay(date);

    const weekday = day !== 0 && day !== 6;
    const showRunning = date > startDay && date < today;

    return weekday && showRunning;
  };

  return (
    <>
      <Navigation />
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <DatePicker
                dateFormat={'EEEE - dd/MM/yyyy'}
                closeOnScroll={true}
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={isValidDay}
                customInput={<ButtonInput />}
              />
              {tracks.map((track, i) => <Box key={i} {...track} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const Box = (props) => {
  return (
    <div className="box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <small>Played at:</small> {Moment(props.played_datetime).format("HH:mm DD/MM/YYYY")}
              <br />
              <small>Title:</small> <strong>{props.title}</strong>
              <br />
              <small>Artist:</small> <strong>{props.artist}</strong>
              <br />
              <small>Album:</small> {props.album}
              <br />
              <small>Label:</small> {props.label}
              <br />
              <small>Release date:</small> {Moment(props.release_date).format("DD/MM/YYYY")}
            </p>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <a className="level-item" href={props.song_link} target="_blank" rel="noreferrer">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fa-solid fa-link"></i>
                  </span>
                  <span>{props.song_link}</span>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  )
}

export default App;