
import sqlite3

connection = sqlite3.connect("db.sqlite3")
cursor = connection.cursor()

cursor.execute(
    "SELECT name, sql FROM sqlite_master WHERE type='table'"
)

for name, sql in cursor.fetchall():
    print(f"\nTABLE: {name}")
    print(sql)

connection.close()
