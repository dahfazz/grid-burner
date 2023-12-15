import { useEffect, useState } from "react";

const API_URL = `https://buzzer-beater-services.onrender.com`;

interface Team {
  key: string;
  name: string;
}

interface Player {
  ppg: number;
  name: string;
}

const App = () => {
  const getTeams = async (): Promise<Team[]> => {
    const req = await fetch(API_URL + '/teams');
    const json = await req.json();

    return json;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>();
  const [players, setPlayers] = useState<Player[]>();
  const [key1, setKey1] = useState<string>();
  const [key2, setKey2] = useState<string>();

  useEffect(() => {
    getTeams().then(t => setTeams(t))
  }, [])

  const pickKey1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setKey1(e.currentTarget.value)
  }
  const pickKey2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setKey2(e.currentTarget.value)
  }

  const burn = async () => {
    setLoading(true)
    setPlayers([])
    const req = await fetch(API_URL + `/cross?t1=${key1}&t2=${key2}`);
    const json = await req.json();

    setPlayers(json);
    setLoading(false)
  }

  return (
    <main className="container py-5">
      <select className="form-select form-select-xl mb-3 border border-black" value={key1} onChange={e => pickKey1(e)} name="team1">
        <option value="">-</option>
        {teams?.map(team => <option key={team.key} value={team.key}>{team.name}</option>)}
      </select>
      <select className="form-select form-select-xl mb-3 border border-black" value={key2} onChange={e => pickKey2(e)} name="team2">
        <option value="">-</option>
        {teams?.map(team => <option key={team.key} value={team.key}>{team.name}</option>)}
      </select>
      <div className="d-flex justify-content-center">
        <button className="btn btn-xl btn-dark" disabled={!key1 || !key2} onClick={_ => burn()}>BURN 🔥</button>
      </div>

      <ul className="list-group mt-5" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        {
          players && players.map(player => <li className="list-group-item" key={player.name}>{player.name}</li>)
        }
      </ul>

      {
        loading && <div style={{ zIndex: 10, top: 0, right: 0, left: 0, bottom: 0 }} className="position-fixed loader d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    </main>
  );
}

export default App;
