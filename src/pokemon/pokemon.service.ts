import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private PokemonModel: Model<Pokemon>,
  ) {}

  // @HttpCode(HttpStatus.OK)
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.PokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.excepciones(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {
      // si esto es un número
      pokemon = await this.PokemonModel.findOne({ no: term });
    }

    // buscar por MongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.PokemonModel.findById(term);
    }

    // buscar por name
    if (!pokemon) {
      pokemon = await this.PokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    // en caso de que no encuentre info del pokemon entonces devolver un 404
    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon con id, nombre o no "${term}" no encontrado`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.excepciones(error);
    }
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    //const result = await this.PokemonModel.findByIdAndDelete( id );

    const { deletedCount } = await this.PokemonModel.deleteOne({ _id: id});
    
    if( deletedCount === 0 )
      throw new BadRequestException(`Pokemon con ese id ${ id } no existe`)

    return;
  }

  private excepciones(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon ya existe en DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `No se pudo crear el pokemon - Revise logs`,
    );
  }
}
