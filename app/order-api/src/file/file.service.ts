import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { FileException } from './file.exception';
import FileValidation from './file.validation';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { FileResponseDto } from './file.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async getFile(filename: string): Promise<FileResponseDto> {
    const file = await this.fileRepository.findOne({
      where: { name: filename },
    });
    if (!file) throw new FileException(FileValidation.FILE_NOT_FOUND);
    return this.mapper.map(file, File, FileResponseDto);
  }

  async uploadFile(file: Express.Multer.File) {
    const context = `${FileService.name}.${this.uploadFile.name}`;
    const createdFile = await this.saveFile(file);
    this.logger.log(`File ${createdFile.name} uploaded successfully`, context);
    return createdFile;
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const context = `${FileService.name}.${this.uploadFiles.name}`;
    const uploadedFiles = await Promise.all(
      files.map((file) => this.saveFile(file))
    );
    this.logger.log(`Files uploaded successfully`, context);
    return uploadedFiles;
  }

  private async saveFile(requestData: Express.Multer.File): Promise<File> {
    if (!requestData) throw new FileException(FileValidation.FILE_NOT_FOUND);
    const file = new File();
    const filename = requestData.originalname.split('.')[0].replace(' ', '-');
    Object.assign(file, {
      data: requestData.buffer.toString('base64'),
      name: `${filename}-${Date.now()}`,
      extension: requestData.originalname.split('.')[1],
      mimetype: requestData.mimetype,
      size: requestData.size,
    });

    this.fileRepository.create(file);
    return await this.fileRepository.save(file);
  }

  public async removeFile(filename?: string): Promise<void> {
    const context = `${FileService.name}.${this.removeFile.name}`;
    const file = await this.fileRepository.findOne({
      where: { name: filename },
    });
    if (!file) return;
    await this.fileRepository.remove(file);
    this.logger.log(`File ${filename} removed successfully`, context);
  }

  public handleDuplicateFilesName(files: Express.Multer.File[]): Express.Multer.File[] {
    const fileNameCount: { [key: string]: number } = {};
    const renamedFiles: Express.Multer.File[] = [];
  
    files.forEach((file) => {
      const fileExtension = file.originalname.split('.').pop();
      const baseName = file.originalname.replace(/\.[^/.]+$/, ''); 
  
      if (fileNameCount[baseName]) {
        fileNameCount[baseName]++;
      } else {
        fileNameCount[baseName] = 1;
      }
  
      const newName = fileNameCount[baseName] === 1
        ? file.originalname
        : `${baseName}(${fileNameCount[baseName] - 1}).${fileExtension}`;
  
      renamedFiles.push({
        ...file,
        originalname: newName,
      });
    });
  
    return renamedFiles;
  }
}
