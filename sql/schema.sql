CREATE TABLE transactions (txn_id INTEGER PRIMARY KEY, from_account TEXT NOT NULL, to_account TEXT NOT NULL, amount REAL NOT NULL, txn_time TEXT NOT NULL);
CREATE TABLE ipl_scores (player TEXT NOT NULL, match_id INTEGER NOT NULL, match_date TEXT NOT NULL, runs INTEGER NOT NULL, PRIMARY KEY (player, match_id));
INSERT INTO transactions VALUES
 (1,'A','B',1000,'2024-03-01 10:00:00'),(2,'B','A',950,'2024-03-01 18:00:00'),   -- round trip (within 10%, <24h)
 (3,'C','D',500,'2024-03-02 09:00:00'),(4,'D','C',300,'2024-03-02 10:00:00'),   -- amount differs >10%
 (5,'E','F',200,'2024-03-03 08:00:00'),(6,'F','E',205,'2024-03-05 08:00:00'),   -- >24h apart
 (7,'G','H',100,'2024-03-04 12:00:00'),(8,'H','G',109,'2024-03-05 11:00:00');   -- round trip (9%, 23h)
INSERT INTO ipl_scores VALUES
 ('Kohli',1,'2024-03-22',45),('Kohli',2,'2024-03-25',77),('Kohli',3,'2024-03-29',51),('Kohli',4,'2024-04-02',20),
 ('Gill',1,'2024-03-24',35),('Gill',2,'2024-03-28',10),('Gill',3,'2024-04-01',60),('Gill',4,'2024-04-05',40),('Gill',5,'2024-04-09',33),('Gill',6,'2024-04-13',31),
 ('Rohit',1,'2024-03-24',30),('Rohit',2,'2024-03-27',31);
