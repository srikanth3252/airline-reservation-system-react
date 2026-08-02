import "../styles/passenger-card.css";

function Passenger_card({ person, index, passengers, setPassengers })
{
    function handleChange(field, value)
    {
        const temp = [...passengers];
        temp[index][field] = value;
        setPassengers(temp);
    }

    return(
        <section className="passenger-card">

            <h1>Passenger {index + 1}</h1>

            <div className="passenger-card-flex1">
                <label>Passenger Name:</label>

                <input
                    type="text"
                    value={person.name}
                    placeholder="Enter the name"
                    onChange={(e) =>
                        handleChange("name", e.target.value)
                    }
                />
            </div>

            <div className="passenger-card-flex1">
                <label>Passenger Age:</label>

                <input
                    type="number"
                    value={person.age}
                    placeholder="Enter the age"
                    onChange={(e) =>
                        handleChange("age", e.target.value)
                    }
                />
            </div>

            <div className="flex1-radio">

                <label>Passenger Gender:</label>

                
                    <input
                        type="radio"
                        name={`gender-${index}`}
                        value="Male"
                        checked={person.gender === "Male"}
                        onChange={(e) =>
                            handleChange("gender", e.target.value)
                        }
                    />
                    Male
                

                
                    <input
                        type="radio"
                        name={`gender-${index}`}
                        value="Female"
                        checked={person.gender === "Female"}
                        onChange={(e) =>
                            handleChange("gender", e.target.value)
                        }
                    />
                    Female
              

                
                    <input
                        type="radio"
                        name={`gender-${index}`}
                        value="Others"
                        checked={person.gender === "Others"}
                        onChange={(e) =>
                            handleChange("gender", e.target.value)
                        }
                    />
                    Others
                

            </div>

        </section>
    );
}

export default Passenger_card;