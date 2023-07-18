# Docker Pull Auto Action
Docker pull auto action sends a request to the repository implementation of [docker-pull-auto](https://github.com/codebysandip).  
This action sends docker image and tag to API `/api/webhook`.

## Inputs

### `docker-image`
**required** 'docker image. Example sandipj/react-ssr-doc

### `docker-tag`
**required** docker tag which you just generated. Example latest

### `domain`
**required** domain on which request will send. Example myawesomeapp.com

### `hook-secret`
**required** hook secret used to verify request coming from docker pull auto action. [Learn more](https://codebysandip.github.io/docker-pull-auto/how-to-create-hook-secret.html)

### `over-http`
request will send over http if true. Default false

### `port`
port on which request will send. Default 443


## Example Usage
```yaml
- name: Docker Pull Auto
  uses: codebysandip/docker-pull-auto-action@v1.5
  with:
    docker-image: sandipj/react-ssr-doc
    docker-tag: prod-1.0
    domain: myawesomeapp.com
    hook-secret: ${{ secrets.HOOK_SECRET}}
```
HOOK_SECRET of docker pull auto action and [docker pull auto](https://codebysandip.github.io/docker-pull-auto) must be same

## Use http request
```yaml
- name: Docker Pull Auto
  uses: codebysandip/docker-pull-auto-action@v1.5
  with:
    docker-image: sandipj/react-ssr-doc
    docker-tag: prod-1.0
    domain: myawesomeapp.com
    hook-secret: ${{ secrets.HOOK_SECRET}}
    over-http: true
```

## Send Request to specific port over http
```yaml
- name: Docker Pull Auto
  uses: codebysandip/docker-pull-auto-action@v1.5
  with:
    docker-image: sandipj/react-ssr-doc
    docker-tag: prod-1.0
    domain: myawesomeapp.com
    hook-secret: ${{ secrets.HOOK_SECRET}}
    over-http: true
    port: 3000
```

## Example of docker pull auto action in [react-ssr-doc](https://github.com/codebysandip/react-ssr-doc)
```yaml
name: Docker build & push

on:
  push:
    branches:
      - "main"
jobs:
  build:
    timeout-minutes: 20
    runs-on: ubuntu-20.04

    steps:
      - uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Get build version
        id: vars
        run: echo short_hash=$(echo ${GITHUB_SHA::8}) >> $GITHUB_OUTPUT

      - name: Get latest commit timestamp
        id: commit_epoch
        run: echo epoch=$(echo $(git show -s --format=%ct))  >> $GITHUB_OUTPUT

      - name: Build and push
        id: docker_build
        uses: docker/build-push-action@v4
        with:
          push: true
          context: ${{ github.workspace }}
          tags: sandipj/react-ssr-doc:prod-${{steps.vars.outputs.short_hash}}-${{steps.commit_epoch.outputs.epoch}}
          build-args: |
            env=prod

      - name: Docker Pull Auto
        uses: codebysandip/docker-pull-auto-action@v1.4
        with:
          docker-image: sandipj/react-ssr-doc
          docker-tag: prod-${{steps.vars.outputs.short_hash}}-${{steps.commit_epoch.outputs.epoch}}
          domain: dockerpullauto.sandipj.dev
          hook-secret: ${{ secrets.HOOK_SECRET }}
```
