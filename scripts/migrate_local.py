import os
from alembic.config import Config
from alembic import command

# Forçar uso do DB local de testes
os.environ['DATABASE_URL'] = 'sqlite:///./test_nexus.db'

cfg = Config('alembic.ini')

# Gera uma revisão autogenerate (se não houver mudanças, não criará alterações)
print('Gerando revisão autogenerate...')
command.revision(cfg, autogenerate=True, message='local initial', rev_id=None)

print('Aplicando migrations (upgrade head)...')
command.upgrade(cfg, 'head')

print('Migrations aplicadas no test_nexus.db')
