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
  uses: codebysandip/docker-pull-auto@v1.2
  with:
    docker-image: sandipj/react-ssr-doc
    docker-tag: prod-1.0
    domain: myawesomeapp.com
    hook-secret: ${{ secrets.HOOK_SECRET}}
```
HOOK_SECRET of docker pull auto action and [docker pull auto](https://codebysandip.github.io/docker-pull-auto) must be same
