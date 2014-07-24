suite('Get task', function() {
  var debug       = require('debug')('test:api:get');
  var assert      = require('assert');
  var slugid      = require('slugid');
  var _           = require('lodash');
  var Promise     = require('promise');
  var helper      = require('./helper');
  var subject     = helper.setup({title: "get task"});

  // Create datetime for created and deadline as 3 days later
  var created = new Date();
  var deadline = new Date();
  deadline.setDate(created.getDate() + 3);

  var taskDef = {
    version:          1,
    provisionerId:    'my-provisioner',
    workerType:       'my-worker',
    // let's just test a large routing key too, 128 chars please :)
    routing:          "jonasfj-test.what-a-hack.I suppose we might " +
                      "actually need it when we add taskgraph scheduler id, " +
                      "taskgraphId, task graph routing",
    retries:          5,
    priority:         1,
    created:          created.toJSON(),
    deadline:         deadline.toJSON(),
    scopes:           [],
    payload:          {},
    metadata: {
      name:           "Unit testing task",
      description:    "Task created during unit tests",
      owner:          'jonsafj@mozilla.com',
      source:         'https://github.com/taskcluster/taskcluster-queue'
    },
    tags: {
      purpose:        'taskcluster-testing'
    }
  };

  test("getTask", function() {
    var taskId = slugid.v4();

    return subject.queue.createTask(taskId, taskDef).then(function(result) {
      return subject.queue.getTask(taskId);
    }).then(function(taskDef2) {
      assert(_.isEqual(taskDef, taskDef2), "Task should be what we uploaded");
    });
  });
});