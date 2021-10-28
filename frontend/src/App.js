import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Moment from 'moment';


const App = () => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTrackIds = (timeout_mseconds) => {
    setIsLoading(true);
    axios.get(`${process.env.REACT_APP_API_SERVICE_URL}/today`)
    .then((res) => {
      const tracks = res.data.tracks;

      // console.log(tracks);
      
      // some delay to avoid spamming clicks on the refresh button
      setTimeout(() => {
        setTracks(tracks);
        setIsLoading(false);
      }, timeout_mseconds);
    })
    .catch((err) => {
      console.log(err);

      setTimeout(() => {
        setIsLoading(false);
      }, timeout_mseconds);
    });
  };

  useEffect(() => {
    getTrackIds(200)
  }, []);

  return (
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
            <div>
              <button
                className={`button is-link is-fullwidth ${isLoading ? "is-loading" : ""}`}
                onClick={() => {getTrackIds(1000)}}
              >Refresh
              </button>
            </div>
            {tracks.map((track, i) => <Box key={i} {...track} />)}
          </div>
        </div>
      </div>
    </section>
  )
};

const Box = (props) => {
  return (
    <div className="box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <small>Played at:</small> {Moment(props.played_datetime).format("HH:mm DD/MM/YYYY")}
              <br />
              <small>Titel:</small> <strong>{props.title}</strong>
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
                    <i className="fas fa-home"></i>
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