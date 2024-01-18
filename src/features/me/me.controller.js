const { MeService } = require('./me.service.js');

exports.MeController = class {
  me({ me }) {
    return MeService.generateMe(me);
  }
  async updateMe({ body, me }) {
    return await MeService.updateMe(me, body);
  }
  async updatePassword({ body, me }) {
    await MeService.updatePassword(me, body.password);
  }
  async updatePhoto({ file, me }) {
    return await MeService.updateMe(me, {
      photoFilename: file.uploadedName,
    });
  }
  async updateEmail({ body, me }) {
    await MeService.updateEmail(me, body.email);
  }
};
