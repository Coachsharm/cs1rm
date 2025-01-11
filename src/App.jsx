import React, { useState, useRef, useEffect } from 'react'
    import { Bar } from 'react-chartjs-2'
    import {
      Chart as ChartJS,
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend,
    } from 'chart.js'
    import ChartDataLabels from 'chartjs-plugin-datalabels'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import { faWeightScale, faRedo, faDumbbell, faEnvelope } from '@fortawesome/free-solid-svg-icons'

    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ChartDataLabels
    )

    const formulas = {
      Epley: (weight, reps) => weight * (1 + reps / 30),
      Brzycki: (weight, reps) => weight * (36 / (37 - reps)),
      Lombardi: (weight, reps) => weight * Math.pow(reps, 0.1)
    }

    const App = () => {
      const [weight, setWeight] = useState(100)
      const [reps, setReps] = useState(5)
      const [formula, setFormula] = useState('Epley')
      const [oneRM, setOneRM] = useState(0)
      const [exercise, setExercise] = useState('')
      const [name, setName] = useState('')
      const [email, setEmail] = useState('')
      const [showTooltip, setShowTooltip] = useState(true);
      const oneRMRef = useRef(null);

      useEffect(() => {
        const calculated1RM = formulas[formula](weight, reps);
        setOneRM(calculated1RM);
      }, [weight, reps, formula]);

      const handleSendEmail = async (e) => {
        e.preventDefault();

        const percentages = [90, 80, 70, 60, 50, 40, 30, 20].map(p => ({
          percentage: p,
          weight: (oneRM * p / 100).toFixed(1)
        }));

        const data = {
          name,
          email,
          oneRM: oneRM.toFixed(1),
          percentages,
          weight,
          reps,
          formula,
          exercise
        };

        try {
          const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            alert('Email sent successfully!');
          } else {
            alert('Failed to send email.');
          }
        } catch (error) {
          console.error(error);
          alert('Failed to send email.');
        }
      };

      const percentages = [90, 80, 70, 60, 50, 40, 30, 20].map(p => ({
        percentage: p,
        weight: (oneRM * p / 100).toFixed(1)
      }))

      const chartData = {
        labels: percentages.map(p => `${p.percentage}%`),
        datasets: [{
          label: 'Weight',
          data: percentages.map(p => p.weight),
          backgroundColor: [
            '#3b82f6', // Light Blue
            '#2563eb', // Medium Blue
            '#1d4ed8', // Darker Blue
            '#1e40af', // Even Darker Blue
            '#1e3a8a', // Dark Blue
            '#1e3a8a', // Dark Blue
            '#1e3a8a', // Dark Blue
            '#1e3a8a'  // Dark Blue
          ]
        }]
      }

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          datalabels: {
            display: true,
            color: 'white',
            anchor: 'end',
            align: 'top',
            formatter: (value) => `${value} kg`
          }
        }
      }

      const hypertrophyData = [6, 8, 10, 12].map(rep => {
        const estimatedWeight = oneRM / (1 + (rep - 1) / 30);
        return { reps: rep, weight: estimatedWeight.toFixed(1) };
      });

      return (
        <div className="min-h-screen bg-gradient-to-b from-[#1E0A2E] to-[#08010F]">
          <div className="min-h-screen p-4 text-white">
            <header className="text-center mb-10 header-animation">
              <div className="mb-4"></div>
              <div className="mb-4"></div>
              <div className="flex justify-center items-center">
                <h1 className="gradient-text text-5xl font-bold mb-3 mr-4">
                  1RM Calculator
                </h1>
                <div className="text-left">
                  <p className="text-gray-400 text-lg mb-1 font-light tracking-wide">
                    Unleash Your Lifting Potential
                  </p>
                  <p className="text-red-500 text-sm italic mt-1">
                    by Coach Sharm and Body Thrive
                  </p>
                  <div className="mt-2">
                    <p className="text-yellow-400 text-sm leading-relaxed">
                      Estimate your 1RM in seconds:
                      <br />
                      - <span className="font-bold">Enter</span> weight and reps.
                      <br />
                      - <span className="font-bold">Select</span> a formula.
                      <br />
                      - Get instant results.
                    </p>
                  </div>
                </div>
              </div>
              <section className="max-w-2xl mx-auto mt-6 text-left">
                <h2 className="text-xl font-bold mb-2 text-gray-200">Understanding Your 1RM</h2>
                <p className="mb-2 text-gray-300">
                  The 1RM (One Repetition Maximum) is the maximum weight you can lift for a single repetition of a given exercise. Knowing your 1RM is crucial for effective strength training, as it helps you determine appropriate weights for different rep ranges and training goals.
                </p>
                <p className="mb-2 text-gray-300">
                  When using this calculator, input the weight you can lift with perfect form and the number of consecutive repetitions you can complete with that same perfect form before you fail. For example, if you can lift a weight for 12 repetitions with perfect form, but fail on the 13th rep, you should input 12 reps.
                </p>
                <p className="text-gray-300">
                  Use this information to plan your workouts, ensuring you're lifting at the right intensity for your goals. Remember to always prioritize safety and proper form over lifting heavy weights.
                </p>
              </section>
            </header>

            <div className="max-w-2xl mx-auto">
              <section className="mb-10 card-box">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="input-container">
                    <FontAwesomeIcon icon={faWeightScale} className="input-icon" />
                    <label className="block mb-2 text-gray-300">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={e => {
                        const newWeight = Number(e.target.value);
                        if (newWeight >= 0) {
                          setWeight(newWeight);
                        }
                      }}
                      className="w-full p-3 border rounded bg-gray-800 border-gray-700 input-shadow focus:outline-none focus:border-teal-300 transition-shadow input-field"
                      placeholder="Enter weight in kg"
                      aria-label="Weight in kilograms"
                    />
                  </div>
                  <div className="input-container">
                    <FontAwesomeIcon icon={faRedo} className="input-icon" />
                    <label className="block mb-2 text-gray-300">Reps</label>
                    <input
                      type="number"
                      value={reps}
                      onChange={e => {
                        const newReps = Number(e.target.value);
                        if (newReps >= 1 && newReps <= 20) {
                          setReps(newReps);
                        }
                      }}
                      min="1"
                      max="20"
                      className="w-full p-3 border rounded bg-gray-800 border-gray-700 input-shadow focus:outline-none focus:border-teal-300 transition-shadow input-field"
                      placeholder="Enter reps (1-20)"
                      aria-label="Reps completed"
                    />
                  </div>
                  <div className="input-container">
                    <FontAwesomeIcon icon={faDumbbell} className="input-icon" />
                    <label className="block mb-2 text-gray-300">Exercise</label>
                    <input
                      type="text"
                      value={exercise}
                      onChange={e => setExercise(e.target.value)}
                      className="w-full p-3 border rounded bg-gray-800 border-gray-700 input-shadow focus:outline-none focus:border-teal-300 transition-shadow input-field"
                      placeholder="Exercise name"
                      aria-label="Exercise name"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block mb-2 text-gray-300">Formula</label>
                  <select
                    value={formula}
                    onChange={e => setFormula(e.target.value)}
                    className="w-full p-3 border rounded bg-gray-800 border-gray-700 input-shadow focus:outline-none focus:border-teal-300 transition-shadow input-field"
                    aria-label="Select a formula"
                  >
                    {Object.keys(formulas).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-200">
                  Your 1RM {exercise ? `for ${exercise}` : '(One rep max for the exercise)'}
                </h2>
                <div className="text-5xl font-bold mb-6 calculate-animation" ref={oneRMRef}>
                  {oneRM.toFixed(1)} kg
                </div>
                <div className="h-72">
                  <Bar
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </section>

              <section className="mb-6 p-4 border rounded border-gray-700 bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-gray-200">What you should lift to improve muscle mass (metabolism)?</h3>
                <div className="flex justify-around">
                  {hypertrophyData.map(item => (
                    <div key={item.reps} className="text-center">
                      <p className="text-gray-300">{item.reps} Reps</p>
                      <p className="font-bold text-gray-100">{item.weight} kg</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-gray-300">
                  To build muscle and boost your metabolism, try doing 2 to 3 sets of this exercise, resting about one minute in between each set. After you finish this exercise (e.g., Squats (Legs, lower body)), do another exercise that works a different body part, like Bench Press (Chest, upper body). If you got time, do 3 to 6 different exercises, otherwise, 3 different exercises that work different body parts also can.
                </p>
              </section>

              <section className="mb-6 p-4 border rounded border-gray-700 bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Want this to be sent directly to your email?</h3>
                <p className="text-red-500">Under construction</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="input-container">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    <label className="block mb-2 text-yellow-300">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-3 border rounded bg-gray-800 border-gray-700 input-shadow focus:outline-none focus:border-teal-300 transition-shadow input-field"
                      placeholder="Enter your name"
                      aria-label="Your name"
                    />
                  </div>
                  <div className="input-container">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    <label className="block mb-2 text-yellow-300">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-3 border rounded bg-gray-800 border-gray-700 input-shadow focus:outline-none focus:border-teal-300 transition-shadow input-field"
                      placeholder="Enter your email"
                      aria-label="Your email address"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSendEmail}
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded button-shadow focus:outline-none transition-shadow hover:scale-105 w-full"
                  aria-label="Send email with results"
                >
                  Send Email
                </button>
              </section>
            </div>

            <footer className="text-center mt-12 text-gray-400 text-sm">
              Stay safe. Lift responsibly.
              <br />
              <a href="https://bodythrive.co" className="text-red-500 hover:underline">Created by Coach Sharm, Msc</a>
            </footer>
          </div>
        </div>
      )
    }

    export default App
