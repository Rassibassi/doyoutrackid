import axios from "axios";
import moment from "moment";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { getDay } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ButtonInput from "../components/ButtonInput/ButtonInput";
import Navigation from "../components/Navigation/Navigation";
import Box from "../components/Box/Box";

const Archive: NextPage = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const getTrackIds = (dateString: string, timeoutMs: number) => {
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_SERVICE_URL}/archive/${dateString}`)
      .then((res) => {
        const tracks = res.data.tracks;

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

  const handleDateChange = (date: Date) => {
    const dateString = moment(date).format("DD/MM/YYYY");
    getTrackIds(dateString, 1000);
    setSelectedDate(date);
  };

  useEffect(() => {
    const dateString = moment(selectedDate).format("DD/MM/YYYY");
    getTrackIds(dateString, 200);
    return () => {
      if (timeoutRef.current !== undefined) {
        // handle memory leak
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValidDay = (date: Date) => {
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
                dateFormat={"EEEE - dd/MM/yyyy"}
                closeOnScroll={true}
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={isValidDay}
                customInput={<ButtonInput isLoading={isLoading} />}
              />
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

export default Archive;
