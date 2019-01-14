const _encodeData = (data)=>{
    return Buffer.from(JSON.stringify(data, Object.keys(data).sort()))
}

module.exports = _encodeData;