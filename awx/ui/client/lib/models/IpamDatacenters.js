let Base;

function IpamDatacenterModel (method, resource, config) {
    Base.call(this, 'ipan_datacenters');

    this.Constructor = IpamDatacenterModel;

    return this.create(method, resource, config);
}

function IpamDatacenterModelLoader (BaseModel) {
    Base = BaseModel;

    return IpamDatacenterModel;
}

IpamDatacenterModelLoader.$inject = [
    'BaseModel'
];

export default IpamDatacenterModelLoader;
