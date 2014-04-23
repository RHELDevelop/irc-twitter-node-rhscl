FROM centos
# Install scls and nodejs
RUN yum update -y
RUN yum install -y centos-release-SCL
RUN yum update -y
RUN yum install -y scl-utils nodejs010
# Clean up
RUN yum clean all
#FROM 1angdon/node-scl-centos  
# ^^^ this is a good place to break to make multiple app containers
#add app
ADD . /src
RUN cd /src; scl enable nodejs010 "npm install"
CMD cd /src; scl enable nodejs010 "node server.js"

