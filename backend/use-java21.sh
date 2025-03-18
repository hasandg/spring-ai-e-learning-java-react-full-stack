#!/bin/bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home
echo "Java home set to: $JAVA_HOME"
echo "Java version:"
java -version
echo "You can now run Maven commands with Java 21" 