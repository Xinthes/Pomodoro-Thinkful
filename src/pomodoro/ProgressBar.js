import React from "react";

function ProgressBar({ session, focusDuration, breakDuration }) {

    const calculateAria = (label, timeRemaining) => {
        if (label === "Focusing") {
          return timeRemaining / (focusDuration * 60);
        }
        return timeRemaining / (breakDuration * 60);
      };

      const time =
        100 - calculateAria(session?.label, session?.timeRemaining) * 100;
    
    return session && (
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={time} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: `${time}%` }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
    )
}

export default ProgressBar