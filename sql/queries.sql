-- Scenario 1: quick round-trip transfers (B returns ~same amount, +/-10%, within 24h)
SELECT t1.txn_id AS out_txn, t2.txn_id AS back_txn, t1.from_account AS account_a, t1.to_account AS account_b,
       t1.amount AS sent, t2.amount AS returned, t1.txn_time AS sent_at, t2.txn_time AS returned_at
FROM transactions t1
JOIN transactions t2
  ON t2.from_account = t1.to_account AND t2.to_account = t1.from_account
 AND t2.txn_time > t1.txn_time
 AND t2.txn_time <= datetime(t1.txn_time, '+24 hours')   -- Postgres: t1.txn_time + INTERVAL '24 hours'
 AND t2.amount BETWEEN t1.amount * 0.9 AND t1.amount * 1.1
ORDER BY t1.txn_time;

-- Scenario 2: 30+ run streaks of >= 3 consecutive matches (gaps-and-islands with window functions)
WITH numbered AS (
  SELECT player, match_date, runs, ROW_NUMBER() OVER (PARTITION BY player ORDER BY match_date) AS rn_all
  FROM ipl_scores WHERE match_date BETWEEN '2024-01-01' AND '2024-12-31'
), hits AS (
  SELECT *, rn_all - ROW_NUMBER() OVER (PARTITION BY player ORDER BY match_date) AS grp
  FROM numbered WHERE runs >= 30
)
SELECT player, MIN(match_date) AS streak_start, COUNT(*) AS streak_length
FROM hits GROUP BY player, grp HAVING COUNT(*) >= 3
ORDER BY player;
