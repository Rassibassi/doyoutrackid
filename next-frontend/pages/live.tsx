import axios from "axios";
import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Box from "../components/Box/Box";
import Navigation from "../components/Navigation/Navigation";

const Live: NextPage = () => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const getTrackIds = (timeoutMs: number) => {
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_SERVICE_URL}/today`)
      .then((res) => {
        const tracks = res.data.tracks;

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
      if (timeoutRef.current !== undefined) {
        // handle memory leak
        clearTimeout(timeoutRef.current);
      }
    };
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
                      <Image
                        width="180"
                        height="194"
                        src="v1640127156/doyoutrackid/logo_admqju.png"
                        alt="Do!!You!!! logo"
                      />
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
                          <a
                            href={process.env.NEXT_PUBLIC_GITHUB_LINK}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Github
                          </a>
                          <br />
                          Give some feedback, email me here:
                          <br />
                          <a
                            href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}?subject=DoYouTrackID`}
                          >
                            {process.env.NEXT_PUBLIC_EMAIL}
                          </a>
                        </small>
                      </p>
                    </div>
                  </div>
                </article>
              </div>
              <button
                className={`button is-link is-fullwidth mb-5${
                  isLoading ? " is-loading" : ""
                }`}
                onClick={() => {
                  getTrackIds(1000);
                }}
              >
                Refresh
              </button>
              {tracks.map((track, i) => (
                <Box key={i} {...track} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Live;
