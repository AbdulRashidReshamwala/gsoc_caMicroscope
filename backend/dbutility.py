from sqlalchemy import Column, Integer, String, DateTime, create_engine, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.pool import SingletonThreadPool


Base = declarative_base()

engine = create_engine('sqlite:///test.db', echo=True,
                       poolclass=SingletonThreadPool)


class Dataset(Base):
    __tablename__ = 'Dataset'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    no_classes = Column(Integer, nullable=False)
    no_image = Column(Integer, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)
    status = Column(Integer, nullable=False)

    def __repr__(self):
        return '<Dataset %r>' % self.id

    def to_json(self):
        return {'id': self.id,
                'name': self.name,
                'no_classes': self.no_classes,
                'no_image': self.no_image,
                'last_updated': self.last_updated,
                'status': self.status}


class Model(Base):
    __tablename__ = 'Model'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    dataset = Column(String, nullable=False)
    lr = Column(Float, nullable=False)
    image_size = Column(Integer, nullable=False)
    epoch = Column(Integer, nullable=False)
    acrchitexture = Column(String, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)
    status = Column(Integer, nullable=False)

    def __repr__(self):
        return '<Model %r>' % self.id
