import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(request) {
    try {
        const { name, year, author, readPage, pageCount } =
            await request.json();
        const finished = readPage === pageCount;
        if (readPage > pageCount) {
            return NextResponse.json(
                {
                    status: "fail",
                    message: "mohon lengkapi data",
                },
                {
                    status: 400,
                }
            );
        }
        const books = await prisma.books.create({
            data: {
                name,
                year,
                author,
                readPage,
                pageCount,
                finished,
            },
            select: {
                id: true,
            },
        });
        return NextResponse.json(
            {
                message: "Succes",
                data: books,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Gagal menambah data",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const author = searchParams.get('author');
        if(author){
          const result = await prisma.books.findMany({
            where:{
              author:{
                contains: author,
              },
            },
          })
          return NextResponse.json({
            status: "success",
            data: result,
          })
        }
        const books = await prisma.books.findMany({
            select: {
                id: true,
                name: true,
                author: true,
            },
        });
        return NextResponse.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Gagal mengambil data data",
            },
            {
                status: 500,
            }
        );
    }
}
