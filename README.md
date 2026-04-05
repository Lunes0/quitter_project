# Quitter Project

Projeto de estudo de rede social estilo Twitter (Quitter)

## 📌 Visão geral

`quitter_project` é uma aplicação fullstack criada como projeto de aprendizado. A ideia é estruturar um serviço de microblogging com recursos básicos de postagens, comentários, curtidas e perfis de usuário.

- Backend: Django + Django REST Framework
- Frontend: Vite + React + TypeScript + TailwindCSS + Heroicons
- Autenticação: JWT (Django REST Framework Simple JWT)
- Banco de dados: SQLite (setup local de desenvolvimento)

## 💻 Deploy

- [Vercel: Quitter](https://quitter-project.vercel.app/login)

## 🧩 Funcionalidades principais

- Cadastro e login de usuários
- Perfil de usuário com avatar
- Criação e listagem de posts
- Comentários em posts
- Curtidas em posts e comentários
- Obras com armazenagem de mídia (ex: avatars)

## 🛠️ Estrutura do projeto

- `backend/`: código do servidor Django
  - `api/`: app principal com models, serializers, views, tests
  - `backend/`: configs globais (settings, urls, wsgi/asgi)
  - `media/`: uploads de arquivos (avatar)
- `frontend/`: app React + TypeScript
  - `src/`: páginas, componentes, hooks, context, API

## 🚀 Como rodar localmente

### 1. Preparar ambiente Python

```bash
cd backend
python -m venv ../env
source ../env/Scripts/activate  # Windows PowerShell
pip install -r requirements.txt
```

### 2. Migrar banco de dados

```bash
python manage.py migrate
```

### 3. Criar superuser (opcional)

```bash
python manage.py createsuperuser
```

### 4. Rodar servidor Django

```bash
python manage.py runserver
```

### 5. Preparar frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse em `http://localhost:5173` (ou porta mostrada pelo Vite).

## 🧪 Testes

Para executar os testes do backend:

```bash
cd backend
pytest
```

### GitHub Actions

O repositório já possui workflow de CI configurado em `.github/workflows/django_ci.yml`:

- gatilho: `push`
- roda em: `ubuntu-latest`
- Python: `3.14.3`
- passos:
  - checkout
  - setup Python
  - instalar dependências (`backend/requirements.txt`)
  - executar `pytest`

## ⚙️ Configurações adicionais

- CORS, `.env` e chaves JWT podem precisar configuração no `backend/backend/settings.py` e no frontend.
- Em produção, use PostgreSQL ou outro DB robusto em vez de SQLite.

## 📚 Referências

- Django
- Django REST Framework
- drf-simplejwt
- React + Vite

## 🧾 Licença

Uso livre para fins de estudo.
