export async function main(ns) {
    var hostname = ns.getHostname();
    var nearby = ns.scan(hostname);
    nearby = nearby.filter(v => v !== 'Home');
    for(const y of nearby.keys()){
        ns.killall(nearby[y]);
    }
}
