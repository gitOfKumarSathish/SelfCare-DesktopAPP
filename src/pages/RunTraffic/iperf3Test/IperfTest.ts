import { EventEmitter } from 'events';
import { join } from 'path';
import { spawn, IPty } from 'node-pty';

export default class Iperf3 extends EventEmitter {
  private ptyProcess: IPty | undefined;
  private args: Array<string>;
  private iperf3Path: string;
  private logs: Array<string> = [];
  private throughPut: number | undefined;
  private error: string | undefined;
  private matchResult: RegExpMatchArray | null;
  private iperf3Output: string | undefined;
  private senderReceiverLine: Array<string> = [];
  private splitArray: Array<string> = [];
  /**
   * On Windows conpty, killing a process while data is being output will cause the conhost
   * data flush mechanism to hang the pty host.
   * Some amount of milliseconds must pass between data events and kill API call.
   * Github links for more info:
   * https://github.com/microsoft/vscode/issues/71966
   * https://github.com/microsoft/node-pty/pull/415
   */
  private dataFlushTimeout = 500;
  private killTimeout: NodeJS.Timeout | undefined;

  constructor(private options: Array<string>) {
    super();
    this.logs.push('Logs from node-iperf3 custom module:');
    this.iperf3Path = join(__dirname, '../bin/', process.platform, 'iperf3');
    this.args = options;
    this.matchResult = null;
  }

  public start(): void {
    if (this.ptyProcess) {
      this.logging('Error: Can\'t start. Iperf3 Already running!!');
      return;
    }
    if (process.platform === 'win32') {
      if (this.args) {
        this.iperf3Path = join(__dirname, '../bin/', process.platform, 'iperf3.exe');
        this.logging(`Spawning iperf with args: ${this.args}`);
        this.args.unshift(this.iperf3Path);
        this.ptyProcess = spawn(this.iperf3Path, this.args, {});
        this.ptyProcess.on('data', (data: string) => {
          if (this.killTimeout) {
            clearTimeout(this.killTimeout);
            this.stop();
          }

          this.iperf3Output = data.toString();
          this.logging(`iperf3 output: ${this.iperf3Output}`);
          if (this.iperf3Output.includes('error')) { // check iperf3 errors and emit the error
            this.emit('error', this.error);
          }
          if (this.iperf3Output.includes('sec')) {
            const arr = [];
            arr.push(this.iperf3Output);
            arr.forEach((ele) => {
              if (ele.includes('sec')) {
                if (ele.includes('send') || ele.includes('rece')) {
                  this.senderReceiverLine = ele.split('\n');
                  this.senderReceiverLine.forEach((ele1) => {
                    if (ele1.includes('send')) {
                      this.matchResult = ele1.match(/\d+/g && /[\d.]+/g);
                      if (this.matchResult) {
                        this.throughPut = parseFloat(this.matchResult[4]);
                        this.emit('sender', this.throughPut);
                      }
                    } else if (ele1.includes('rece')) {
                      this.splitArray = ele1.split('/sec');
                      this.matchResult = this.splitArray[0].match(/\d+/g && /[\d.]+/g);
                      if (this.matchResult) {
                        this.throughPut = parseFloat(this.matchResult[this.matchResult.length - 1]);
                        this.emit('receiver', this.throughPut);
                      }
                    } else if (ele1.includes('sec')) {
                      this.splitArray = ele1.split('/sec');
                      this.matchResult = this.splitArray[0].match(/\d+/g && /[\d.]+/g);
                      if (this.matchResult) {
                        this.throughPut = parseFloat(this.matchResult[this.matchResult.length - 1]);
                        this.emit('interval', this.throughPut);
                      }
                    }
                  });
                } else {
                  this.splitArray = ele.split('/sec');
                  this.matchResult = this.splitArray[0].match(/\d+/g && /[\d.]+/g);
                  // this.matchResult = ele.match(/\d+/g && /[\d.]+/g);
                  if (this.matchResult) {
                    this.throughPut = parseFloat(this.matchResult[this.matchResult.length - 1]);
                    // this.throughPut = parseFloat(this.matchResult[5]);
                    this.emit('interval', this.throughPut);
                  }
                }
              }
            });
          }
        });
        this.ptyProcess.on('exit', (exitCode: number) => {
          this.logging(`process exit with exit code: ${exitCode}`);
          this.emit('exit', exitCode);
          this.logging(`exit code: ${(exitCode)}`);
          this.emit('logs', this.logs.join(''));
        });
      }
    } else if (process.platform === 'linux' || process.platform === 'darwin') {
      if (this.args) {
        this.logging(`Spawning iperf with args: ${this.args}`);
        this.ptyProcess = spawn(this.iperf3Path, this.args, {});
        this.ptyProcess.on('data', (data: string) => {
          this.iperf3Output = data.toString();
          this.logging(`iperf3 output: ${this.iperf3Output}`);
          if (this.iperf3Output.includes('error')) { // check iperf3 errors and emit the error
            this.error = this.iperf3Output;
            this.emit('error', this.error);
          }
          if (this.iperf3Output.includes('sec')) {
            const singleLine = (this.iperf3Output.split('\r\n'));
            singleLine.forEach((ele) => {
              if (ele.includes('sec')) {
                if (ele.includes('sec') && ele.includes('sender')) {
                  this.matchResult = ele.match(/\d+/g && /[\d.]+/g);
                  if (this.matchResult) {
                    this.throughPut = parseFloat(this.matchResult[4]);
                    this.emit('sender', this.throughPut);
                  }
                } else if (ele.includes('sec') && ele.includes('receiver')) {
                  this.matchResult = ele.match(/\d+/g && /[\d.]+/g);
                  if (this.matchResult) {
                    this.throughPut = parseFloat(this.matchResult[4]);
                    this.emit('receiver', this.throughPut);
                  }
                } else {
                  this.matchResult = ele.match(/\d+/g && /[\d.]+/g);
                  if (this.matchResult) {
                    this.throughPut = parseFloat(this.matchResult[4]);
                    this.emit('interval', this.throughPut);
                  }
                }
              }
            });
          }
        });
        this.ptyProcess.on('exit', (exitCode: number) => {
          this.logging(`process exit with exit code: ${exitCode}`);
          this.emit('exit', exitCode);
          this.logging(`exit code: ${(exitCode)}`);
          this.emit('logs', this.logs.join(''));
        });
      }
    }
  }

  public stop(): void {
    if (this.killTimeout) {
      clearTimeout(this.killTimeout);
    }
    this.killTimeout = setTimeout(() => {
      this.killTimeout = undefined;
      try {
        if (this.ptyProcess) {
          this.ptyProcess.kill();
        }
      } catch (ex) {
        // the pty has already been killed
      }
    }, this.dataFlushTimeout);
  }

  private logging(log: string): void {
    this.logs.push(`\n  ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}: ${log}`);
    this.logs = this.logs.slice(-50);
  }
}
