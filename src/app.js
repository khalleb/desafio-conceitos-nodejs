const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).send('Repository not found');
  }

  const projectIndex = repositories.findIndex(project => project.id === id);

  const project = { id, title, url, techs, likes: repositories[projectIndex].likes};
  repositories[projectIndex] = project;

  return response.json(project)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).send('Repository not found');
  }
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  repositories.splice(repositoryIndex, 1);
  return response.status(204).json()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).send('Repository not found');
  }
  const repository = repositories.find(repository => repository.id === id);
  repository.likes++;
  return response.json(repository);
});

module.exports = app;
