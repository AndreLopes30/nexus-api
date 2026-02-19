from app.db.database import engine

if __name__ == "__main__":
    try:
        connection = engine.connect()
       print("✅ Conectou no PostgreSQL com sucesso!")
       connection.close()
    except Exception as e:
        print("❌ Erro ao conectar:", e)