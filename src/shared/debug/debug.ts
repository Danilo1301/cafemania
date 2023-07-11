export class Debug {
    public static useConsoleFormat = true;

    public static log(title: string, ...args) {
        if(!Array.isArray(args)) args = [args];

        if(args.length == 0) {
            args.push(title);
            title = "Debug";
        }

        if(this.useConsoleFormat) {
            console.log.apply(this, [`%c${title}`, "color: #0058B2"].concat(args)); 
            return;
        }
        console.log.apply(this, [`[${title}]`].concat(args));
    }
}