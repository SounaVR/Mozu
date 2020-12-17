/**
 * @author ex_ode aka the bg
 */

var spawn = require('child_process').spawn,
events    = require('events'),
fs        = require('fs'),
WIN       = /^win/.test(process.platform),
LIN       = /^linux/.test(process.platform);

module.exports = PingL;

function PingL(host, opt) {
    if (!host) throw new Error('A valid host must be provided to use pingL');

    this._host = host;
    this._opt  = opt = (opt || {});

    events.EventEmitter.call(this);

    if (WIN) {
        this._bin      = 'c:/windows/system32/ping.exe';
        this._args     = (opt.args) ? opt.args : ['-n' , '1' , '-w' , '5000' , host];
        this._regmatch = /[><=](0-9.)+? ms/; 
    } else if (LIN) {
        this._bin  = '/usr/bin/ping';
        this._args = (opt.args) ? opt.args : ['-n' , '-w' , '2' , '-c' , '1' , host];
        this._regmatch = /=([0-9.]+?) ms/;
    } else {
        throw new Error('Cannot detect ping binary');
    }

    if (fs.existsSync(this._bin)) throw new Error('Cannot detect ' + this._bin + ' on this system');

    this._i = 0;

    return this;
}

PingL.prototype.send = function(callback) {
    var self = this;
    callback = callback || function(err, ms) {
        if (err) return self.emit('error', err);
        else     return self.emit('result', ms);
    };

    var _end, _exit, _error;

    this._ping = spawn(this._bin, this._args);
    this._ping.on('error', function(err) {
        _error = true;
        callback(err);
    });

    this._ping.stdout.on('data', function(data) {
        this._stdout = (this._stdout || '') + data;
    });

    this._ping.stdout.on('end' , function() {
        _end = true;
        if(_exit && _error) onEnd.call(self._ping);
    });

    function onEnd() {
        var stdout = this.stdout._stdout,
            stderr = this.stderr._stderr,
            ms;
        
        if (stderr) return callback(new Error(stderr));
        else if (!stdout) return callback(new Error('No stdout detected'));

        ms = stdout.match(self._regmatch);
        ms = (ms && ms[1]) ? Number(ms[1]) : ms;

        callback(null, ms);
    }
};

PingL.prototype.start = function(callback) {
    var self = this;
    this._i = setInterval(function() {
        self.send(callback);
    } , (self._opt.interval || 5000));
    self.send(callback);
};

PingL.prototype.stop = function() {
    clearInterval(this._i);
};