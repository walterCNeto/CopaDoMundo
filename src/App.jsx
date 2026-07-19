import { useState, useMemo } from "react";

/* ============================================================
   SIMULADOR DE COPA DO MUNDO
   Seleções carregadas da planilha copa.xlsx (86 times).
   Força = pontos estilo ranking FIFA (aprox. — editáveis).
   ============================================================ */

const BASE_TEAMS = [
  { id: 1, name: "África do Sul", pts: 1450 },
  { id: 2, name: "Albânia", pts: 1400 },
  { id: 3, name: "Alemanha", pts: 1715 },
  { id: 4, name: "Argélia", pts: 1510 },
  { id: 5, name: "Argentina", pts: 1870 },
  { id: 6, name: "Armênia", pts: 1290 },
  { id: 7, name: "Áustria", pts: 1585 },
  { id: 8, name: "Austrália", pts: 1570 },
  { id: 9, name: "Bélgica", pts: 1735 },
  { id: 10, name: "Bolívia", pts: 1320 },
  { id: 11, name: "Bósnia", pts: 1410 },
  { id: 12, name: "Botsuana", pts: 1050 },
  { id: 13, name: "Brasil", pts: 1780 },
  { id: 14, name: "Bulgária", pts: 1300 },
  { id: 15, name: "Cabo Verde", pts: 1450 },
  { id: 16, name: "Camarões", pts: 1475 },
  { id: 17, name: "Canadá", pts: 1560 },
  { id: 18, name: "Catar", pts: 1420 },
  { id: 19, name: "Chile", pts: 1470 },
  { id: 20, name: "China", pts: 1290 },
  { id: 21, name: "Singapura", pts: 1090 },
  { id: 22, name: "Colômbia", pts: 1690 },
  { id: 23, name: "Coreia do Norte", pts: 1150 },
  { id: 24, name: "Coreia do Sul", pts: 1590 },
  { id: 25, name: "Costa do Marfim", pts: 1490 },
  { id: 26, name: "Costa Rica", pts: 1460 },
  { id: 27, name: "Croácia", pts: 1705 },
  { id: 28, name: "Dinamarca", pts: 1630 },
  { id: 29, name: "Egito", pts: 1515 },
  { id: 30, name: "Emirados Árabes Unidos", pts: 1390 },
  { id: 31, name: "Equador", pts: 1590 },
  { id: 32, name: "Eslováquia", pts: 1470 },
  { id: 33, name: "Eslovênia", pts: 1460 },
  { id: 34, name: "Espanha", pts: 1880 },
  { id: 35, name: "EUA", pts: 1680 },
  { id: 36, name: "Estônia", pts: 1250 },
  { id: 37, name: "Filipinas", pts: 1130 },
  { id: 38, name: "Finlândia", pts: 1410 },
  { id: 39, name: "França", pts: 1860 },
  { id: 40, name: "Gana", pts: 1440 },
  { id: 41, name: "Grécia", pts: 1495 },
  { id: 42, name: "Haiti", pts: 1300 },
  { id: 43, name: "Holanda", pts: 1755 },
  { id: 44, name: "Hungria", pts: 1500 },
  { id: 45, name: "Índia", pts: 1180 },
  { id: 46, name: "Indonésia", pts: 1160 },
  { id: 47, name: "Irã", pts: 1620 },
  { id: 48, name: "Iraque", pts: 1420 },
  { id: 49, name: "Islândia", pts: 1400 },
  { id: 50, name: "Irlanda", pts: 1400 },
  { id: 51, name: "Israel", pts: 1380 },
  { id: 52, name: "Itália", pts: 1700 },
  { id: 53, name: "Jamaica", pts: 1380 },
  { id: 54, name: "Japão", pts: 1650 },
  { id: 55, name: "Kosovo", pts: 1370 },
  { id: 56, name: "Líbano", pts: 1250 },
  { id: 57, name: "Luxemburgo", pts: 1320 },
  { id: 58, name: "Malásia", pts: 1150 },
  { id: 59, name: "Malta", pts: 1130 },
  { id: 60, name: "Marrocos", pts: 1705 },
  { id: 61, name: "México", pts: 1675 },
  { id: 62, name: "Mônaco", pts: 950 },
  { id: 63, name: "Nigéria", pts: 1480 },
  { id: 64, name: "Noruega", pts: 1520 },
  { id: 65, name: "Nova Zelândia", pts: 1290 },
  { id: 66, name: "Panamá", pts: 1470 },
  { id: 67, name: "Paquistão", pts: 900 },
  { id: 68, name: "Peru", pts: 1480 },
  { id: 69, name: "Paraguai", pts: 1475 },
  { id: 70, name: "Polônia", pts: 1545 },
  { id: 71, name: "RD do Congo", pts: 1450 },
  { id: 72, name: "Portugal", pts: 1770 },
  { id: 73, name: "Suécia", pts: 1550 },
  { id: 74, name: "Reino Unido", pts: 1815 },
  { id: 75, name: "Rep. Dominicana", pts: 1200 },
  { id: 76, name: "Rep. Checa", pts: 1490 },
  { id: 77, name: "Romênia", pts: 1480 },
  { id: 78, name: "Rússia", pts: 1530 },
  { id: 79, name: "Senegal", pts: 1640 },
  { id: 80, name: "Sérvia", pts: 1520 },
  { id: 81, name: "Suíça", pts: 1655 },
  { id: 82, name: "Tunísia", pts: 1500 },
  { id: 83, name: "Turquia", pts: 1555 },
  { id: 84, name: "Uruguai", pts: 1670 },
  { id: 85, name: "Uzbequistão", pts: 1440 },
  { id: 86, name: "Venezuela", pts: 1320 },
];

/* ---------------- Motor de probabilidade ---------------- */

// Expectativa de vitória (modelo Elo com escala de pontos FIFA)
const winExp = (a, b) => 1 / (1 + Math.pow(10, -(a - b) / 600));

// Probabilidades de um jogo (V / E / D do time A)
function matchProbs(ptsA, ptsB, knockout) {
  const we = winExp(ptsA, ptsB);
  if (knockout) {
    // no mata-mata o empate leva a pênaltis; tratamos direto como classificação
    return { w: we, d: 0, l: 1 - we };
  }
  const d = 0.27 * Math.exp(-Math.pow((ptsA - ptsB) / 700, 2));
  return { w: we * (1 - d), d, l: (1 - we) * (1 - d) };
}

function poisson(l) {
  const L = Math.exp(-l);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// Gera um placar coerente com o resultado sorteado
function makeScore(outcome, diff) {
  if (outcome === "d") {
    const g = poisson(1.0);
    return [g, g];
  }
  const loser = poisson(0.85);
  const margin = 1 + poisson(0.5 + Math.min(1.2, Math.abs(diff) / 900));
  return outcome === "w" ? [loser + margin, loser] : [loser, loser + margin];
}

// Simula um jogo. probs pode vir de override do usuário.
function simulateMatch(teamA, teamB, probs, knockout) {
  const r = Math.random();
  let outcome;
  if (r < probs.w) outcome = "w";
  else if (r < probs.w + probs.d) outcome = "d";
  else outcome = "l";

  const diff = teamA.pts - teamB.pts;

  if (!knockout) {
    const [ga, gb] = makeScore(outcome, diff);
    return { ga, gb, pens: null, winner: outcome === "w" ? teamA.id : outcome === "l" ? teamB.id : null };
  }

  // Mata-mata: chance do jogo ir a pênaltis mesmo com um classificado definido
  const penChance = 0.24 * Math.exp(-Math.abs(diff) / 550);
  const wentToPens = Math.random() < penChance;
  if (wentToPens) {
    const g = poisson(0.9);
    const pw = 3 + poisson(0.9);
    const pl = Math.max(0, pw - 1 - poisson(0.7));
    return {
      ga: g, gb: g,
      pens: outcome === "w" ? [pw, pl] : [pl, pw],
      winner: outcome === "w" ? teamA.id : teamB.id,
    };
  }
  const [ga, gb] = makeScore(outcome === "l" ? "l" : "w", diff);
  return { ga, gb, pens: null, winner: outcome === "l" ? teamB.id : teamA.id };
}

/* ---------------- Helpers de torneio ---------------- */

const GROUP_LETTERS = "ABCDEFGH".split("");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sorteio por potes: pote 1 = cabeças de chave, etc.
function drawGroups(teams, nGroups) {
  const sorted = [...teams].sort((x, y) => y.pts - x.pts);
  const pots = [];
  for (let p = 0; p < 4; p++) pots.push(sorted.slice(p * nGroups, (p + 1) * nGroups));
  const groups = Array.from({ length: nGroups }, () => []);
  pots.forEach((pot) => {
    shuffle(pot).forEach((t, i) => groups[i].push(t));
  });
  return groups;
}

// Rodadas de um grupo de 4 (índices dentro do grupo)
const GROUP_FIXTURES = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];

function emptyStanding(team) {
  return { team, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 };
}

function computeStandings(group, matches) {
  const table = Object.fromEntries(group.map((t) => [t.id, emptyStanding(t)]));
  matches.forEach((m) => {
    if (!m.result) return;
    const A = table[m.a.id], B = table[m.b.id];
    const { ga, gb } = m.result;
    A.j++; B.j++; A.gp += ga; A.gc += gb; B.gp += gb; B.gc += ga;
    if (ga > gb) { A.v++; B.d++; A.pts += 3; }
    else if (gb > ga) { B.v++; A.d++; B.pts += 3; }
    else { A.e++; B.e++; A.pts++; B.pts++; }
  });
  return Object.values(table).sort(
    (x, y) =>
      y.pts - x.pts ||
      (y.gp - y.gc) - (x.gp - x.gc) ||
      y.gp - x.gp ||
      y.team.pts - x.team.pts
  );
}

const pct = (v) => `${Math.round(v * 100)}%`;

/* ---------------- Componentes visuais ---------------- */

const C = {
  bg: "#0A1F17",
  panel: "#10291F",
  panel2: "#0D2419",
  line: "rgba(240,248,244,0.14)",
  chalk: "rgba(240,248,244,0.85)",
  text: "#F2F7F4",
  muted: "#93B0A3",
  amber: "#FFC53D",
  green: "#2E9E6B",
  red: "#E4604F",
};

function Score({ value }) {
  return (
    <span
      className="px-2 py-0.5 rounded"
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        background: "#061510",
        color: C.amber,
        border: `1px solid ${C.line}`,
        minWidth: 30,
        display: "inline-block",
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
  );
}

function ProbBar({ probs, labels }) {
  const parts = [
    { v: probs.w, c: C.green, l: labels[0] },
    ...(probs.d > 0 ? [{ v: probs.d, c: "#7A8C84", l: labels[1] }] : []),
    { v: probs.l, c: C.red, l: labels[2] },
  ];
  return (
    <div>
      <div className="flex h-2 rounded overflow-hidden" style={{ background: "#061510" }}>
        {parts.map((p, i) => (
          <div key={i} style={{ width: pct(p.v), background: p.c, opacity: 0.9 }} />
        ))}
      </div>
      <div className="flex justify-between mt-1" style={{ fontSize: 11, color: C.muted }}>
        {parts.map((p, i) => (
          <span key={i}>
            {p.l} <b style={{ color: C.text }}>{pct(p.v)}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProbEditor({ probs, knockout, onApply, onCancel }) {
  const [w, setW] = useState(Math.round(probs.w * 100));
  const [d, setD] = useState(Math.round(probs.d * 100));
  const [l, setL] = useState(Math.round(probs.l * 100));
  const total = w + (knockout ? 0 : d) + l;
  const apply = () => {
    const t = total || 1;
    onApply(
      knockout
        ? { w: w / t, d: 0, l: l / t }
        : { w: w / t, d: d / t, l: l / t }
    );
  };
  const field = (label, val, set) => (
    <label className="flex flex-col items-center gap-1" style={{ fontSize: 11, color: C.muted }}>
      {label}
      <input
        type="number"
        min={0}
        max={100}
        value={val}
        onChange={(e) => set(Number(e.target.value))}
        className="w-16 rounded px-1 py-0.5 text-center"
        style={{ background: "#061510", color: C.text, border: `1px solid ${C.line}` }}
      />
    </label>
  );
  return (
    <div
      className="mt-2 p-3 rounded-lg"
      style={{ background: C.panel2, border: `1px dashed ${C.line}` }}
    >
      <p className="mb-2" style={{ fontSize: 12, color: C.muted }}>
        Ajuste as probabilidades (em %). Serão normalizadas para somar 100%.
      </p>
      <div className="flex items-end gap-3 flex-wrap">
        {field("Vitória mandante", w, setW)}
        {!knockout && field("Empate", d, setD)}
        {field("Vitória visitante", l, setL)}
        <span style={{ fontSize: 11, color: total === 100 ? C.muted : C.amber }}>
          soma: {total}%
        </span>
        <button
          onClick={apply}
          className="px-3 py-1 rounded font-semibold"
          style={{ background: C.amber, color: "#1B1B10", fontSize: 12 }}
        >
          Aplicar
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded"
          style={{ border: `1px solid ${C.line}`, color: C.muted, fontSize: 12 }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function MatchCard({ match, knockout, override, onOverride, onSimulate, tag }) {
  const [editing, setEditing] = useState(false);
  const probs = override ?? matchProbs(match.a.pts, match.b.pts, knockout);
  const played = !!match.result;

  return (
    <div
      className="p-3 rounded-lg"
      style={{ background: C.panel, border: `1px solid ${C.line}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className="truncate"
              style={{
                color: match.result?.winner === match.a.id ? C.amber : C.text,
                fontWeight: match.result?.winner === match.a.id ? 700 : 500,
              }}
            >
              {match.a.name}
            </span>
            {played && <Score value={match.result.ga} />}
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <span
              className="truncate"
              style={{
                color: match.result?.winner === match.b.id ? C.amber : C.text,
                fontWeight: match.result?.winner === match.b.id ? 700 : 500,
              }}
            >
              {match.b.name}
            </span>
            {played && <Score value={match.result.gb} />}
          </div>
          {played && match.result.pens && (
            <p className="mt-1" style={{ fontSize: 11, color: C.muted }}>
              {match.result.pens[0]} × {match.result.pens[1]} nos pênaltis
            </p>
          )}
        </div>
        {!played && (
          <div className="flex flex-col gap-1 shrink-0">
            <button
              onClick={onSimulate}
              className="px-3 py-1 rounded font-semibold"
              style={{ background: C.green, color: "#03150C", fontSize: 12 }}
            >
              Simular
            </button>
            <button
              onClick={() => setEditing((v) => !v)}
              className="px-3 py-1 rounded"
              style={{
                border: `1px solid ${override ? C.amber : C.line}`,
                color: override ? C.amber : C.muted,
                fontSize: 12,
              }}
            >
              {override ? "Prob. ajustada" : "Ajustar prob."}
            </button>
          </div>
        )}
        {tag && (
          <span
            className="shrink-0 self-start px-1.5 py-0.5 rounded"
            style={{ fontSize: 10, color: C.muted, border: `1px solid ${C.line}` }}
          >
            {tag}
          </span>
        )}
      </div>

      {!played && (
        <div className="mt-2">
          <ProbBar
            probs={probs}
            labels={[match.a.name.split(" ")[0], "Empate", match.b.name.split(" ")[0]]}
          />
        </div>
      )}

      {!played && editing && (
        <ProbEditor
          probs={probs}
          knockout={knockout}
          onApply={(p) => { onOverride(p); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  const [teams, setTeams] = useState(BASE_TEAMS);
  const [format, setFormat] = useState(32); // 16 ou 32
  const [selected, setSelected] = useState(() =>
    new Set([...BASE_TEAMS].sort((a, b) => b.pts - a.pts).slice(0, 32).map((t) => t.id))
  );
  const [stage, setStage] = useState("setup"); // setup | groups | knockout | done
  const [groups, setGroups] = useState([]);
  const [groupMatches, setGroupMatches] = useState([]); // [gIdx][matchIdx]
  const [overrides, setOverrides] = useState({}); // matchKey -> probs
  const [bracket, setBracket] = useState([]); // rounds -> matches
  const [third, setThird] = useState(null);

  const teamById = useMemo(
    () => Object.fromEntries(teams.map((t) => [t.id, t])),
    [teams]
  );
  const nGroups = format / 4;

  /* ---------- setup ---------- */
  const toggleTeam = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else if (s.size < format) s.add(id);
      return s;
    });
  };

  const pickTop = () =>
    setSelected(new Set([...teams].sort((a, b) => b.pts - a.pts).slice(0, format).map((t) => t.id)));
  const pickRandom = () =>
    setSelected(new Set(shuffle(teams).slice(0, format).map((t) => t.id)));

  const changeFormat = (f) => {
    setFormat(f);
    setSelected(new Set([...teams].sort((a, b) => b.pts - a.pts).slice(0, f).map((t) => t.id)));
  };

  const editPts = (id, v) =>
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, pts: Math.max(600, Math.min(2200, v)) } : t)));

  const startDraw = () => {
    const chosen = teams.filter((t) => selected.has(t.id));
    const gs = drawGroups(chosen, nGroups);
    setGroups(gs);
    setGroupMatches(
      gs.map((g, gi) =>
        GROUP_FIXTURES.flatMap((round, ri) =>
          round.map(([i, j], mi) => ({
            key: `g${gi}r${ri}m${mi}`,
            a: g[i],
            b: g[j],
            round: ri + 1,
            result: null,
          }))
        )
      )
    );
    setOverrides({});
    setBracket([]);
    setThird(null);
    setStage("groups");
  };

  /* ---------- fase de grupos ---------- */
  const simGroupMatch = (gi, key) => {
    setGroupMatches((gm) =>
      gm.map((g, i) =>
        i !== gi
          ? g
          : g.map((m) => {
              if (m.key !== key || m.result) return m;
              const probs = overrides[m.key] ?? matchProbs(m.a.pts, m.b.pts, false);
              return { ...m, result: simulateMatch(m.a, m.b, probs, false) };
            })
      )
    );
  };

  const simAllGroups = () => {
    setGroupMatches((gm) =>
      gm.map((g) =>
        g.map((m) => {
          if (m.result) return m;
          const probs = overrides[m.key] ?? matchProbs(m.a.pts, m.b.pts, false);
          return { ...m, result: simulateMatch(m.a, m.b, probs, false) };
        })
      )
    );
  };

  const groupsDone =
    groupMatches.length > 0 && groupMatches.every((g) => g.every((m) => m.result));

  const standings = useMemo(
    () => groups.map((g, i) => computeStandings(g, groupMatches[i] ?? [])),
    [groups, groupMatches]
  );

  const startKnockout = () => {
    const q = standings.map((s) => [s[0].team, s[1].team]); // [grupo][1º,2º]
    let pairs;
    if (nGroups === 8) {
      pairs = [
        [q[0][0], q[1][1]], [q[2][0], q[3][1]],
        [q[4][0], q[5][1]], [q[6][0], q[7][1]],
        [q[1][0], q[0][1]], [q[3][0], q[2][1]],
        [q[5][0], q[4][1]], [q[7][0], q[6][1]],
      ];
    } else {
      pairs = [
        [q[0][0], q[1][1]], [q[2][0], q[3][1]],
        [q[1][0], q[0][1]], [q[3][0], q[2][1]],
      ];
    }
    setBracket([
      pairs.map((p, i) => ({ key: `k0m${i}`, a: p[0], b: p[1], result: null })),
    ]);
    setStage("knockout");
  };

  const roundName = (ri, totalRounds) => {
    const fromEnd = totalRounds - ri;
    if (fromEnd === 1) return "Final";
    if (fromEnd === 2) return "Semifinal";
    if (fromEnd === 3) return "Quartas de final";
    return "Oitavas de final";
  };
  const totalRounds = nGroups === 8 ? 4 : 3;

  // Função pura: se a última rodada estiver completa, gera a próxima.
  // Retorna também o jogo de 3º lugar quando as semifinais terminam.
  const growBracket = (br) => {
    const last = br[br.length - 1];
    if (!last.every((m) => m.result)) return { br };
    if (br.length === totalRounds) return { br };
    const winners = last.map((m) => teamById[m.result.winner]);
    if (winners.length === 2) {
      const losers = last.map((m) => (m.result.winner === m.a.id ? m.b : m.a));
      return {
        br: [...br, [{ key: `k${br.length}m0`, a: winners[0], b: winners[1], result: null }]],
        newThird: { key: "third", a: losers[0], b: losers[1], result: null },
      };
    }
    const next = [];
    for (let i = 0; i < winners.length; i += 2) {
      next.push({ key: `k${br.length}m${i / 2}`, a: winners[i], b: winners[i + 1], result: null });
    }
    return { br: [...br, next] };
  };

  const simKnockMatch = (ri, key) => {
    const nb = bracket.map((round, i) =>
      i !== ri
        ? round
        : round.map((m) => {
            if (m.key !== key || m.result) return m;
            const probs = overrides[m.key] ?? matchProbs(m.a.pts, m.b.pts, true);
            return { ...m, result: simulateMatch(m.a, m.b, probs, true) };
          })
    );
    const g = growBracket(nb);
    setBracket(g.br);
    if (g.newThird && !third) setThird(g.newThird);
  };

  const simThird = () => {
    setThird((t) => {
      if (!t || t.result) return t;
      const probs = overrides[t.key] ?? matchProbs(t.a.pts, t.b.pts, true);
      return { ...t, result: simulateMatch(t.a, t.b, probs, true) };
    });
  };

  const simAllKnockout = () => {
    let nb = bracket;
    let nt = third;
    for (let guard = 0; guard < 10; guard++) {
      nb = nb.map((round) =>
        round.map((m) => {
          if (m.result) return m;
          const probs = overrides[m.key] ?? matchProbs(m.a.pts, m.b.pts, true);
          return { ...m, result: simulateMatch(m.a, m.b, probs, true) };
        })
      );
      const g = growBracket(nb);
      if (g.newThird && !nt) nt = g.newThird;
      if (g.br === nb) break;
      nb = g.br;
    }
    if (nt && !nt.result) {
      const probs = overrides[nt.key] ?? matchProbs(nt.a.pts, nt.b.pts, true);
      nt = { ...nt, result: simulateMatch(nt.a, nt.b, probs, true) };
    }
    setBracket(nb);
    setThird(nt);
  };

  const finalMatch = bracket.length === totalRounds ? bracket[totalRounds - 1][0] : null;
  const champion = finalMatch?.result ? teamById[finalMatch.result.winner] : null;
  const runnerUp =
    finalMatch?.result &&
    (finalMatch.result.winner === finalMatch.a.id ? finalMatch.b : finalMatch.a);

  const resetAll = () => {
    setStage("setup");
    setGroups([]);
    setGroupMatches([]);
    setBracket([]);
    setThird(null);
    setOverrides({});
  };

  /* ---------- UI ---------- */

  const StepPill = ({ id, label }) => {
    const order = ["setup", "groups", "knockout", "done"];
    const active = stage === id;
    const passed = order.indexOf(stage) > order.indexOf(id);
    return (
      <span
        className="px-3 py-1 rounded-full uppercase tracking-widest"
        style={{
          fontSize: 10,
          letterSpacing: "0.14em",
          color: active ? "#03150C" : passed ? C.amber : C.muted,
          background: active ? C.amber : "transparent",
          border: `1px solid ${active || passed ? C.amber : C.line}`,
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full" style={{ background: C.bg, color: C.text }}>
      {/* faixa de campo ao fundo */}
      <div
        className="w-full"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 80px, transparent 80px 160px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <header className="mb-6">
            <p
              className="uppercase"
              style={{ fontSize: 11, letterSpacing: "0.3em", color: C.muted }}
            >
              Simulador · 86 seleções da planilha
            </p>
            <h1
              className="uppercase mt-1"
              style={{
                fontSize: "clamp(26px, 5vw, 44px)",
                fontWeight: 900,
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              Copa do Mundo
            </h1>
            <div className="flex gap-2 mt-4 flex-wrap items-center">
              <StepPill id="setup" label="Seleções" />
              <StepPill id="groups" label="Grupos" />
              <StepPill id="knockout" label="Mata-mata" />
              <StepPill id="done" label="Campeão" />
              {stage !== "setup" && (
                <button
                  onClick={resetAll}
                  className="ml-auto px-3 py-1 rounded"
                  style={{ border: `1px solid ${C.line}`, color: C.muted, fontSize: 12 }}
                >
                  Recomeçar
                </button>
              )}
            </div>
          </header>

          {/* ================= SETUP ================= */}
          {stage === "setup" && (
            <section>
              <div
                className="p-4 rounded-xl mb-4"
                style={{ background: C.panel, border: `1px solid ${C.line}` }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span style={{ fontSize: 13, color: C.muted }}>Formato:</span>
                  {[16, 32].map((f) => (
                    <button
                      key={f}
                      onClick={() => changeFormat(f)}
                      className="px-3 py-1 rounded font-semibold"
                      style={{
                        fontSize: 13,
                        background: format === f ? C.amber : "transparent",
                        color: format === f ? "#1B1B10" : C.text,
                        border: `1px solid ${format === f ? C.amber : C.line}`,
                      }}
                    >
                      {f} seleções · {f / 4} grupos
                    </button>
                  ))}
                  <span className="mx-2" style={{ color: C.line }}>|</span>
                  <button
                    onClick={pickTop}
                    className="px-3 py-1 rounded"
                    style={{ fontSize: 13, border: `1px solid ${C.line}` }}
                  >
                    Top {format} do ranking
                  </button>
                  <button
                    onClick={pickRandom}
                    className="px-3 py-1 rounded"
                    style={{ fontSize: 13, border: `1px solid ${C.line}` }}
                  >
                    Sorteio aleatório
                  </button>
                  <span
                    className="ml-auto font-semibold"
                    style={{
                      fontSize: 13,
                      color: selected.size === format ? C.green : C.amber,
                    }}
                  >
                    {selected.size}/{format} selecionadas
                  </span>
                </div>
                <p className="mt-2" style={{ fontSize: 12, color: C.muted }}>
                  A força de cada seleção usa pontos no estilo do ranking FIFA
                  (valores aproximados). Se discordar de algum, edite o número —
                  ou ajuste a probabilidade jogo a jogo mais adiante.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[...teams]
                  .sort((a, b) => b.pts - a.pts)
                  .map((t, idx) => {
                    const on = selected.has(t.id);
                    return (
                      <div
                        key={t.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                        style={{
                          background: on ? C.panel : "transparent",
                          border: `1px solid ${on ? C.green : C.line}`,
                          opacity: on || selected.size < format ? 1 : 0.45,
                        }}
                        onClick={() => toggleTeam(t.id)}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: C.muted,
                            width: 24,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {idx + 1}º
                        </span>
                        <span className="flex-1 truncate" style={{ fontSize: 14 }}>
                          {t.name}
                        </span>
                        <input
                          type="number"
                          value={t.pts}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => editPts(t.id, Number(e.target.value))}
                          className="w-16 rounded px-1 py-0.5 text-right"
                          style={{
                            fontSize: 12,
                            background: "#061510",
                            color: C.amber,
                            border: `1px solid ${C.line}`,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        />
                      </div>
                    );
                  })}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={startDraw}
                  disabled={selected.size !== format}
                  className="px-5 py-2 rounded-lg font-bold uppercase tracking-wider"
                  style={{
                    fontSize: 14,
                    background: selected.size === format ? C.amber : C.panel,
                    color: selected.size === format ? "#1B1B10" : C.muted,
                    border: `1px solid ${selected.size === format ? C.amber : C.line}`,
                    cursor: selected.size === format ? "pointer" : "not-allowed",
                  }}
                >
                  Sortear grupos →
                </button>
              </div>
            </section>
          )}

          {/* ================= GRUPOS ================= */}
          {stage === "groups" && (
            <section>
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <button
                  onClick={simAllGroups}
                  className="px-4 py-1.5 rounded font-semibold"
                  style={{ background: C.green, color: "#03150C", fontSize: 13 }}
                >
                  Simular toda a fase de grupos
                </button>
                <button
                  onClick={startDraw}
                  className="px-4 py-1.5 rounded"
                  style={{ border: `1px solid ${C.line}`, color: C.muted, fontSize: 13 }}
                >
                  Refazer sorteio
                </button>
                {groupsDone && (
                  <button
                    onClick={startKnockout}
                    className="ml-auto px-5 py-1.5 rounded font-bold uppercase tracking-wider"
                    style={{ background: C.amber, color: "#1B1B10", fontSize: 13 }}
                  >
                    Ir para o mata-mata →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groups.map((g, gi) => (
                  <div
                    key={gi}
                    className="rounded-xl p-4"
                    style={{ background: C.panel2, border: `1px solid ${C.line}` }}
                  >
                    <h2
                      className="uppercase mb-3"
                      style={{
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        color: C.amber,
                      }}
                    >
                      Grupo {GROUP_LETTERS[gi]}
                    </h2>

                    {/* tabela */}
                    <div
                      className="rounded-lg overflow-hidden mb-3"
                      style={{ border: `1px solid ${C.line}` }}
                    >
                      <table className="w-full" style={{ fontSize: 13 }}>
                        <thead>
                          <tr style={{ color: C.muted, fontSize: 11 }}>
                            {["Seleção", "P", "J", "V", "E", "D", "SG"].map((h, i) => (
                              <th
                                key={h}
                                className={`py-1.5 px-2 ${i === 0 ? "text-left" : "text-center"}`}
                                style={{ borderBottom: `1px solid ${C.line}`, fontWeight: 600 }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {standings[gi]?.map((s, i) => (
                            <tr
                              key={s.team.id}
                              style={{
                                background: i < 2 ? "rgba(46,158,107,0.12)" : "transparent",
                              }}
                            >
                              <td className="py-1.5 px-2">
                                <span style={{ color: C.muted, marginRight: 6, fontSize: 11 }}>
                                  {i + 1}
                                </span>
                                {s.team.name}
                              </td>
                              <td className="text-center font-bold" style={{ color: C.amber }}>
                                {s.pts}
                              </td>
                              <td className="text-center">{s.j}</td>
                              <td className="text-center">{s.v}</td>
                              <td className="text-center">{s.e}</td>
                              <td className="text-center">{s.d}</td>
                              <td className="text-center">{s.gp - s.gc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* jogos */}
                    <div className="grid grid-cols-1 gap-2">
                      {(groupMatches[gi] ?? []).map((m) => (
                        <MatchCard
                          key={m.key}
                          match={m}
                          knockout={false}
                          tag={`Rodada ${m.round}`}
                          override={overrides[m.key]}
                          onOverride={(p) =>
                            setOverrides((o) => ({ ...o, [m.key]: p }))
                          }
                          onSimulate={() => simGroupMatch(gi, m.key)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= MATA-MATA ================= */}
          {stage === "knockout" && (
            <section>
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <button
                  onClick={simAllKnockout}
                  className="px-4 py-1.5 rounded font-semibold"
                  style={{ background: C.green, color: "#03150C", fontSize: 13 }}
                >
                  Simular todo o mata-mata
                </button>
                {champion && (
                  <button
                    onClick={() => setStage("done")}
                    className="ml-auto px-5 py-1.5 rounded font-bold uppercase tracking-wider"
                    style={{ background: C.amber, color: "#1B1B10", fontSize: 13 }}
                  >
                    Ver campeão →
                  </button>
                )}
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                {bracket.map((round, ri) => (
                  <div key={ri}>
                    <h3
                      className="uppercase mb-2"
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        color: C.muted,
                        fontWeight: 700,
                      }}
                    >
                      {roundName(ri, totalRounds)}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {round.map((m) => (
                        <MatchCard
                          key={m.key}
                          match={m}
                          knockout
                          override={overrides[m.key]}
                          onOverride={(p) =>
                            setOverrides((o) => ({ ...o, [m.key]: p }))
                          }
                          onSimulate={() => simKnockMatch(ri, m.key)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {third && (
                  <div>
                    <h3
                      className="uppercase mb-2"
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        color: C.muted,
                        fontWeight: 700,
                      }}
                    >
                      Disputa de 3º lugar
                    </h3>
                    <MatchCard
                      match={third}
                      knockout
                      override={overrides[third.key]}
                      onOverride={(p) =>
                        setOverrides((o) => ({ ...o, [third.key]: p }))
                      }
                      onSimulate={simThird}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ================= CAMPEÃO ================= */}
          {stage === "done" && champion && (
            <section className="text-center py-10">
              <p
                className="uppercase"
                style={{ fontSize: 12, letterSpacing: "0.3em", color: C.muted }}
              >
                Campeão do mundo
              </p>
              <div style={{ fontSize: 64, lineHeight: 1.1 }}>🏆</div>
              <h2
                className="uppercase mt-2"
                style={{
                  fontSize: "clamp(32px, 6vw, 56px)",
                  fontWeight: 900,
                  color: C.amber,
                  letterSpacing: "0.02em",
                }}
              >
                {champion.name}
              </h2>
              <p className="mt-3" style={{ color: C.muted }}>
                Final: {finalMatch.a.name}{" "}
                <b style={{ color: C.text }}>
                  {finalMatch.result.ga} × {finalMatch.result.gb}
                </b>{" "}
                {finalMatch.b.name}
                {finalMatch.result.pens &&
                  ` (${finalMatch.result.pens[0]} × ${finalMatch.result.pens[1]} nos pênaltis)`}
              </p>
              <p style={{ color: C.muted, fontSize: 14 }}>Vice: {runnerUp.name}</p>
              {third?.result && (
                <p style={{ color: C.muted, fontSize: 14 }}>
                  3º lugar: {teamById[third.result.winner].name}
                </p>
              )}
              <div className="mt-8 flex justify-center gap-3">
                <button
                  onClick={() => setStage("knockout")}
                  className="px-4 py-2 rounded"
                  style={{ border: `1px solid ${C.line}`, color: C.muted, fontSize: 13 }}
                >
                  ← Rever chaveamento
                </button>
                <button
                  onClick={resetAll}
                  className="px-5 py-2 rounded font-bold uppercase tracking-wider"
                  style={{ background: C.amber, color: "#1B1B10", fontSize: 13 }}
                >
                  Nova Copa
                </button>
              </div>
            </section>
          )}

          <footer className="mt-10 pb-4" style={{ fontSize: 11, color: C.muted }}>
            Modelo: expectativa de vitória tipo Elo sobre a diferença de pontos
            (escala 600), empates decaindo com a diferença de força e placares
            gerados por Poisson coerentes com o resultado sorteado. Todas as
            probabilidades podem ser sobrescritas manualmente antes de cada jogo.
          </footer>
        </div>
      </div>
    </div>
  );
}
