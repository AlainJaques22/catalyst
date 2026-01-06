FROM camunda/camunda-bpm-platform:7.21.0

# Install timezone data and set timezone from build arg
ARG TZ=UTC
USER root
RUN apk add --no-cache tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo "$TZ" > /etc/timezone
USER camunda
ENV TZ=$TZ

# Remove sample webapps to prevent them from respawning
RUN rm -rf /camunda/webapps/examples \
    && rm -rf /camunda/webapps/docs \
    && rm -rf /camunda/webapps/h2 \
    && rm -rf /camunda/webapps/camunda-invoice

# Also remove the invoice sample from the deployment directory if it exists
RUN rm -rf /camunda/webapps/camunda-invoice.war 2>/dev/null || true

# Copy the catalyst-bridge delegate JAR to lib directory (on Tomcat classpath)
# Make sure to place your catalyst-bridge JAR in the same directory as this Dockerfile
# The COPY command will set appropriate permissions automatically
COPY --chown=camunda:camunda catalyst-bridge-*.jar /camunda/lib/

# Enable CORS for the REST API by copying custom web.xml
COPY --chown=camunda:camunda web.xml /camunda/webapps/engine-rest/WEB-INF/web.xml

# Configure Camunda to use JSON serialization by default
COPY --chown=camunda:camunda bpm-platform.xml /camunda/conf/bpm-platform.xml

# The base image already defines the entrypoint and cmd
