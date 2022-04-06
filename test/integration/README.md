#Integration Tests
For {service name} Service.

##Scope
* The scope of these tests is to test the REST method, including integration with the Database sources 
(i.e. mysql and redis).
  * We should use Docker containers to setup fresh data sources and message queues, for example, Redis, MySQL, RabbitMQ. 
  * We can either use AWS services directly (ensuring they are not the real staging/production services), or stub them.

* These tests should use mocks/stubs/spies for any _other_ external dependencies that (should) have their 
own tests, i.e. HTTP requests.

