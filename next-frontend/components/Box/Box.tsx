import moment from "moment";
import Link from "@fortawesome/fontawesome-free/svgs/solid/link.svg";

export interface IBoxProps {
  played_datetime: moment.MomentInput;
  album: string;
  label: string;
  title: string;
  artist: string;
  song_link: string;
  release_date: moment.MomentInput;
}

const Box = (props: IBoxProps) => {
  return (
    <div className="box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <small>Played at:</small>{" "}
              {moment(props.played_datetime).format("HH:mm DD/MM/YYYY")}
              <br />
              <small>Title:</small> <strong>{props.title}</strong>
              <br />
              <small>Artist:</small> <strong>{props.artist}</strong>
              <br />
              <small>Album:</small> {props.album}
              <br />
              <small>Label:</small> {props.label}
              <br />
              <small>Release date:</small>{" "}
              {moment(props.release_date).format("DD/MM/YYYY")}
            </p>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <a
                className="level-item"
                href={props.song_link}
                target="_blank"
                rel="noreferrer"
              >
                <span className="icon-text">
                  <span className="icon">
                    <Link />
                  </span>
                  <span>{props.song_link}</span>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  );
};

export default Box;
