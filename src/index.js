const express = require('express');

const { v4, validate } = require('uuid');

const app = express();

app.use(express.json());

const projects = [];

function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next();
};

function validadeProjectId(request, response, next) {
    const { id } = request.params;

    if (!validate(id)) {
        return response.status(400).json({ error: 'Invalid project ID.' });
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validadeProjectId);

app.get('/projects', (request, response) => {
    return response.json(projects);
});

app.get('/projects/filter', (request, response) => {
    const { title } = request.query;

    const result = title ? projects.filter(project => project.title.includes(title)) : '';

    return response.status(200).json(result);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: v4(), title, owner };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;

    const { title, owner } = request.body;

    const projectIndex = projects.find(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' });
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project;

    return response.json(project);

});


app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.find(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' });
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();

});

app.listen(3333, () => {
    console.log('🚀 Back-end started!');
});