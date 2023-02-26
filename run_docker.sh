docker build -t pynecone-project:latest .
docker run -d -p 3000:3000 -p 8000:8000 --name pynecone pynecone:latest