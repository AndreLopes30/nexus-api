from app.db.database import engine

try:
    connection = engine.connect()
    print("✅ Conectou no PostgreSQL com sucesso!")
    connection.close()
except Exception as e:
    print("❌ Erro ao conectar:", e)
