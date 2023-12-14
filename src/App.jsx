import { useState, useEffect } from "react";
import stopwatch from "./assets/stopwatch.svg";
import close from "./assets/close.svg";
import "./App.css";

function TimeStamp(props) {
    const removeTimeStamp = () => {
        if (props.removeCallback) {
            props.removeCallback();
        }
    };

    return (
        <div className="container is-flex is-justify-content-space-between">
            <label className="label is-large">{props.time}</label>
            <a
                className="is-flex is-align-items-center"
                onClick={removeTimeStamp}
            >
                <img className="image is-32x32 mb-2" src={close} alt="Close" />
            </a>
        </div>
    );
}

function App() {
    const [timestamps, setTimestamps] = useState([]);
    const [watchingTime, setWatchingTime] = useState(false);
    const [timeLabel, setTimeLabel] = useState("Time: ");
    const [elapsedTime, setElapsedTime] = useState(0);

    const removeTimestamp = (index) => {
        // Remove the timeStamp with the X index from the timestamps state
        setTimestamps((prevTimestamps) => {
            const updatedTimestamps = [...prevTimestamps];
            updatedTimestamps.splice(index, 1);
            return updatedTimestamps;
        });
    };

    // Update the timeLabel component based on the current state of watching time
    useEffect(() => {
        let intervalId;

        const startWatchingTime = () => {
            intervalId = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 100);
        };

        const stopWatchingTime = () => {
            clearInterval(intervalId);
        };

        if (watchingTime) {
            startWatchingTime();
            setTimeLabel("Time: " + intervalId);
        } else {
            stopWatchingTime();
            setTimeLabel("Time: ");
        }

        // Clean up the interval when the component unmounts or when watchingTime changes
        return () => {
            stopWatchingTime();
        };
    }, [watchingTime]);

    useEffect(() => {
        // Format elapsed time into hours, minutes, and seconds
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;

        // Update the timeLabel with the formatted time
        setTimeLabel(`Time: ${minutes}m ${seconds}s`);
    }, [elapsedTime]);

    const handleStartWatchTime = () => {
        setWatchingTime(true);
    };

    const handleStopWatchTime = () => {
        setWatchingTime(false);

        // Displays the minutes and seconds in the times-section element
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = elapsedTime % 60;
        setTimestamps((prevTimestamps) => [
            ...prevTimestamps,
            `${minutes}m ${seconds}s`,
        ]);
        setElapsedTime(0);
    };

    return (
        <>
            <a className="stop-watch-class">
                <img
                    src={stopwatch}
                    id="stop-watch"
                    className="image stopwatch_img"
                    alt="Stopwatch Image"
                />
            </a>
            <section className="is-flex container is-fluid">
                <button
                    onClick={handleStartWatchTime}
                    className="button is-primary ml-4 mb-4 mt-2"
                >
                    Start Watch
                </button>
                <button
                    onClick={handleStopWatchTime}
                    className="button is-danger ml-6 mb-4 mt-2"
                >
                    Stop Watch
                </button>
            </section>
            <label className="label is-large">{timeLabel}</label>
            <section
                className="container is-fluid times-section"
                id="times-section"
            >
                {timestamps.map((time, idx) => (
                    <TimeStamp
                        key={idx}
                        time={time}
                        removeCallback={() => removeTimestamp(idx)}
                    />
                ))}
            </section>
        </>
    );
}

export default App;
