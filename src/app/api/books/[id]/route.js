import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }){
  const id = params.id;

  const books = await prisma.books.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!books){
    return NextResponse.json(
      {
        status: "fail",
        message: "Buku tidak ditemukan"
      },
      {
        status: 404,
      }
    )
  }
  return NextResponse.json({
    data: books,
  });
}

export async function PUT(request, { params }){
  const id = params.id;
  try {
    const {readPage} = await request.json();
    const books = await prisma.books.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!books){
      return NextResponse.json(
        {
          status: "fail",
          message: "Buku tidak ditemukan"
        },
        {
          status: 404,
        }
      )
    }

    const finished = readPage === books.pageCount
    if(readPage > books.pageCount){
      return NextResponse.json({
        status: "fail",
        message: "Gagal memperbarui buku, readPage tidak boleh lebih besar dari pageCount"
      })
    }
  const updatebooks = await prisma.books.update({
    where:{
      id: parseInt(id),
    },
    data:{
      finished,
      readPage
    }
  })
    return NextResponse.json({
      data: updatebooks,
    });
  } catch (error) {
    console.log(error)
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

export async function DELETE(request, { params }){
  const id = params.id;
  const books = await prisma.books.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!books){
    return NextResponse.json(
      {
        status: "fail",
        message: "Buku tidak ditemukan"
      },
      {
        status: 404,
      }
    )
  }
  await prisma.books.delete({
    where:{
      id: parseInt(id)
    },
  });
  return NextResponse.json({
    status: "Success",
    message: "Buku berhasil dihapus"
  })
}


