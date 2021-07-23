import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import TimerCountdown from "./TimerCountdown";
import ProgressBar from "./ProgressBar";
import Buttons from "./Buttons"

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  if(!prevState){
    return null
  }
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.                              DONE
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      if (session === null) {
        return setSession(null)
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  const handleFocusDecrease = () => {
    setFocusDuration((currentDuration) => Math.max(5, currentDuration - 5));
  };

  const handleFocusIncrease = () => {
    setFocusDuration((currentDuration) => Math.min(60, currentDuration + 5));
  };

  const handleBreakDecrease = () => {
    setBreakDuration((currentDuration) => Math.max(1, currentDuration - 1));
  };

  const handleBreakIncrease = () => {
    setBreakDuration((currentDuration) => Math.min(15, currentDuration + 1));
  };

  const handleReset = () => {
    setFocusDuration(25)
    setBreakDuration(5)
    setIsTimerRunning(false)
    setSession(null)
  }

  console.log(session)

  return (
    <div className="pomodoro">
      <div>
        <Buttons 
        session={session} 
        breakDuration={breakDuration} 
        focusDuration={focusDuration} 
        handleBreakDecrease={handleBreakDecrease} 
        handleBreakIncrease={handleBreakIncrease} 
        handleFocusDecrease={handleFocusDecrease} 
        handleFocusIncrease={handleFocusIncrease} 
        playPause={playPause} 
        isTimerRunning={isTimerRunning} 
        handleReset={handleReset} 
        classNames={classNames} 
        />
      </div>
      <div>
        <TimerCountdown 
        session={session} 
        breakDuration={breakDuration} 
        focusDuration={focusDuration} 
        />
        <ProgressBar 
        session={session}
        breakDuration={breakDuration} 
        focusDuration={focusDuration} 
        />
      </div>
    </div>
  );
}

export default Pomodoro;
