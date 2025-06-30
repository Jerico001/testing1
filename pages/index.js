
import { useState } from 'react';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [courtCount, setCourtCount] = useState(1);
  const [toPoints, setToPoints] = useState(21);
  const [matches, setMatches] = useState([]);
  const [round, setRound] = useState(1);
  const [leaderboard, setLeaderboard] = useState({});

  const addPlayer = () => {
    if (!name.trim()) return;
    const newPlayer = { name, points: 0, w: 0, d: 0, l: 0, played: 0 };
    setPlayers([...players, newPlayer]);
    setLeaderboard({ ...leaderboard, [name]: newPlayer });
    setName('');
  };

  const resetGame = () => {
    setPlayers([]);
    setMatches([]);
    setRound(1);
    setLeaderboard({});
  };

  const generateMatches = () => {
    const sorted = [...players].sort((a, b) => (leaderboard[b.name]?.points ?? 0) - (leaderboard[a.name]?.points ?? 0));
    const matchups = [];
    const groups = {
      1: [[0, 3], [1, 2]],
      2: [[4, 7], [5, 6]]
    };
    for (let i = 0; i < courtCount; i++) {
      const group = groups[i + 1];
      if (group && group[0][1] < sorted.length && group[1][1] < sorted.length) {
        matchups.push({
          court: i + 1,
          team1: [sorted[group[0][0]], sorted[group[0][1]]],
          team2: [sorted[group[1][0]], sorted[group[1][1]]],
          score1: '',
          score2: ''
        });
      }
    }
    setMatches(matchups);
  };

  const submitScores = () => {
    const updated = { ...leaderboard };
    matches.forEach(({ team1, team2, score1, score2 }) => {
      const s1 = parseInt(score1);
      const s2 = parseInt(score2);
      if (!isNaN(s1) && !isNaN(s2)) {
        const outcome = s1 === s2 ? 'draw' : s1 > s2 ? 'win1' : 'win2';
        team1.forEach(p => {
          updated[p.name].points += s1;
          updated[p.name].played += 1;
          if (outcome === 'draw') updated[p.name].d += 1;
          else if (outcome === 'win1') updated[p.name].w += 1;
          else updated[p.name].l += 1;
        });
        team2.forEach(p => {
          updated[p.name].points += s2;
          updated[p.name].played += 1;
          if (outcome === 'draw') updated[p.name].d += 1;
          else if (outcome === 'win2') updated[p.name].w += 1;
          else updated[p.name].l += 1;
        });
      }
    });
    setLeaderboard(updated);
    setRound(r => r + 1);
    setMatches([]);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Mexicano Padel App</h1>
      <div>
        <input placeholder="Player name" value={name} onChange={e => setName(e.target.value)} />
        <button onClick={addPlayer}>Add Player</button>
        <button onClick={resetGame}>Reset</button>
      </div>
      <div style={{ marginTop: 10 }}>
        <label>Courts: </label>
        <select value={courtCount} onChange={e => setCourtCount(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
        <label style={{ marginLeft: 10 }}>Play to: </label>
        <select value={toPoints} onChange={e => setToPoints(Number(e.target.value))}>
          <option value={21}>21</option>
          <option value={24}>24</option>
        </select>
      </div>
      <h2>Players:</h2>
      <ul>{players.map(p => <li key={p.name}>{p.name}</li>)}</ul>
      <h2>Round {round}</h2>
      <button onClick={generateMatches}>Generate Match</button>
      {matches.map((m, i) => (
        <div key={i}>
          <h4>Court {m.court}</h4>
          <div>{m.team1.map(p => p.name).join(' & ')} vs {m.team2.map(p => p.name).join(' & ')}</div>
          <input type="number" placeholder="Team 1" value={m.score1} onChange={e => {
            const updated = [...matches];
            updated[i].score1 = e.target.value;
            setMatches(updated);
          }} />
          <input type="number" placeholder="Team 2" value={m.score2} onChange={e => {
            const updated = [...matches];
            updated[i].score2 = e.target.value;
            setMatches(updated);
          }} />
        </div>
      ))}
      {matches.length > 0 && <button onClick={submitScores}>Submit Scores</button>}
      <h2>Leaderboard</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr><th>Player</th><th>Points</th><th>W-D-L</th><th>Played</th></tr>
        </thead>
        <tbody>
          {Object.values(leaderboard).sort((a, b) => b.points - a.points).map(p => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.points}</td>
              <td>{p.w}-{p.d}-{p.l}</td>
              <td>{p.played}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
