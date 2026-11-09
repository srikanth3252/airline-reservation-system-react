
import "../styles/passenger-card.css";

function Passenger_card({ person, index, passengers, setPassengers }) {
  const handleChange = (field, value) => {
    const updatedPassengers = passengers.map((passenger, i) =>
      i === index ? { ...passenger, [field]: value } : passenger
    );
    setPassengers(updatedPassengers);
  };

  return (
    <section className="passenger-card">
      <div className="passenger-card-heading">
        <div className="passenger-card-number">{index + 1}</div>
        <div>
          <h2>Passenger {index + 1}</h2>
          <p>Enter passenger details as shown on their ID.</p>
        </div>
      </div>

      <div className="passenger-card-fields">
        <div className="passenger-card-flex1">
          <label htmlFor={`passenger-name-${index}`}>
            Passenger Name
          </label>
          <input
            id={`passenger-name-${index}`}
            type="text"
            value={person.name}
            placeholder="Enter full name"
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="passenger-card-flex1">
          <label htmlFor={`passenger-age-${index}`}>
            Passenger Age
          </label>
          <input
            id={`passenger-age-${index}`}
            type="number"
            min="1"
            max="120"
            value={person.age}
            placeholder="Age"
            onChange={(e) => handleChange("age", e.target.value)}
          />
        </div>
      </div>

      <div className="flex1-radio">
        <label className="passenger-gender-label">
          Passenger Gender
        </label>

        <div className="passenger-gender-options">
          {["Male", "Female", "Others"].map((gender) => (
            <label className="passenger-gender-option" key={gender}>
              <input
                type="radio"
                name={`gender-${index}`}
                value={gender}
                checked={person.gender === gender}
                onChange={() => handleChange("gender", gender)}
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Passenger_card;
